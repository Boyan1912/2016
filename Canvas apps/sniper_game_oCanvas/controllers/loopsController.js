var loopsController = (function(modelsCntrl, bgCntrl, models, calculations, staticModels){
    var activeLoops = [],
        activeTimeouts = [],
        timerMummies,
        timerJinns,
        timerDemons;

    function sendModelsTowardsPlayer(enemies, speedTime, areaSize, refreshRate){
        enemies = enemies || models.getAllEnemyModels();
        speedTime = speedTime || Settings.Enemies.SpeedOptions.DefaultEnemyTimeToCrossField;
        areaSize = areaSize || Settings.Enemies.Positioning.DefaultRadius;
        refreshRate = refreshRate || Settings.GamePerformance.TravelDirectionRefreshTime;
        // returns interval Id
        var loopId = setInterval(function(){

            for (var i = 0; i < enemies.length; i++) {
              var shooter = models.getShooterFromField();
              var enemy = enemies[i];
              var place = enemy.name === 'jinn' ? Settings.Enemies.Positioning.JinnsAboutPlace : shooter;
              var rndPlace = models.getRandomCoordinatesAroundPlace(place, areaSize);
              actionController.moveToPoint(enemy, rndPlace.x, rndPlace.y, speedTime);
            }
        }, refreshRate);

        activeLoops.push(loopId);

        return loopId;
    }

    function setJinnsShooting(frequency){
        var loopId = setInterval(function(){
            var jinns = models.getAllJinns();
            for (var i = 0; i < jinns.length; i++) {
                var jinn = jinns[i],
                    player = models.getShooterFromField(),
                    fires = Math.random() < frequency && i % 2 == 0;
                if(fires && models.getAllFireBalls().length <= Settings.GamePerformance.Constraints.MaxNumberFireBallsAllowed){
                  jinn.shoot(models.getRandomCoordinatesAroundPlace(player, Settings.Enemies.Positioning.JinnsShotAroundPlace));
                }
            }

        }, Settings.Enemies.JinnsShootingAttemptFrequency);

        activeLoops.push(loopId);
    }

    function setBlastCollisionDetection(tolerance){
        var loopId = setInterval(function(){
            var blasts = models.getAllActiveExplosions(),
            victims = models.getAllDamageableModels();
            tolerance = tolerance || Settings.Player.DefaultExplosionDamageArea;

            for (var i = 0; i < victims.length; i++) {
                var potentialVictim = victims[i];
                var damage = calculations.detectManyToOneCollision(potentialVictim, blasts, tolerance);
                if(damage){
                    modelsCntrl.updateModelHealth(potentialVictim, damage);
                }
            }
            // TESTING PERFORMANCE
            if (staticModels.megaDeathCaused()){  // models.megaDeathCaused()
                modelsCntrl.updateModelHealth(models.getShooterFromField(), { bonus: Settings.Gameplay.BonusDamageForMegadeath});
                bgCntrl.animateBgOnce('tada');
                soundsController.playSoundOnMegaDeath();
            }

        }, Settings.GamePerformance.DetectBlastDamageRefreshTime);

        activeLoops.push(loopId);
    }

    function setBlastsConcentrationDetection(tolerance, options){
      options = options || {};
      options.countInflamables = options.countInflamables || Settings.FireOptions.MinCountInflamablesOnField;
      options.maxNumberFires = options.maxNumberFires || Settings.FireOptions.MaxNumberOfFiresPossible;

      var loopId = setInterval(function(){
          var blasts = models.getAllActiveAndPotentialExplosions();
          tolerance = tolerance || Settings.Player.DefaultExplosionDamageArea;

          if (blasts.length >= options.countInflamables && blasts.length < options.maxNumberFires){
            for (var i = 0; i < blasts.length; i++) {
              var currentBlast = blasts[i];
              var sampleModel = {
                    x: currentBlast.x,
                    y: currentBlast.y,
                  };
              var damage = calculations.detectManyToOneCollision(sampleModel, blasts, tolerance);
              let result = {
                damage: damage,
                place: sampleModel
              };
              lightFires(result);
            }
          }
      }, Settings.GamePerformance.DetectFireIgnitionRefreshTime);

        activeLoops.push(loopId);
    }

    function lightFires(options){
      options = options || {};
      options.minDamage = options.minDamage || Settings.FireOptions.MinDamageCausedToIgnite;
      options.radius = options.radius || Settings.FireOptions.BurningRadius;
      options.speedOfFire = options.speedOfFire || Settings.Enemies.SpeedOptions.FireTimeToCrossField;
      options.burnDuration = options.burnDuration || Settings.FireOptions.MinBurningTime;
      options.countNewFires = options.countNewFires || Settings.FireOptions.DefaultNumberNewFiresToAdd;
      options.fireType = options.fireType || Settings.FireOptions.DefaultFireType;

      if (options.damage > options.minDamage){
          var fires = modelsCntrl.addEnemiesToGame(options.countNewFires, options.fireType, options.place);
          for (var i = 0; i < fires.length; i++) {
              var rndPlace = models.getRandomCoordinatesAroundPlace(options.place, options.radius);
              actionController.moveToPoint(fires[i], rndPlace.x, rndPlace.y, options.speedOfFire, null, null, null, function(){
                 this.burn(options.burnDuration);
            });
          }
      }
    }

    function setPlayerCollisionDetection(tolerance){
        var loopId = setInterval(function(){
            tolerance = tolerance || Settings.Player.PlayerCollisionTolerance;
            var player = models.getShooterFromField();
            var damage = calculations.detectManyToOneCollision(player, models.getAllEnemyModels(), tolerance);
            if(damage){
                modelsCntrl.updateModelHealth(player, damage);
            }
        }, Settings.GamePerformance.DetectPlayerCollisionRefreshTime);

        activeLoops.push(loopId);
    }

    function setStaticObjectsCollisionDetection(staticObjects, tolerance) {
        var loopId = setInterval(function(){
            staticObjects = staticObjects || staticModels.getAllStaticItems();
            tolerance = tolerance || Settings.Player.PlayerCollisionTolerance;

            var player = models.getShooterFromField();

            var staticObject = calculations.detectManyToOneCollision(player, staticObjects, tolerance);
            if(staticObject){
                modelsCntrl.updatePlayerAttributes(player, staticObject);
                staticObject.disappear();
            }

        }, Settings.GamePerformance.DetectStaticObjectsCollisionRefreshTime);

        activeLoops.push(loopId);
    }

    function getActiveLoopingObjects(objects){
        var names = [];
        for (var i = 0; i < objects.length; i++) {
            var loopObj = objects[i];
            if(names.indexOf(loopObj.name) < 0){
                names.push(loopObj.name);
            }
        }

        return models.getVariousTypesByName(names);
    }

    function setPlayerProvisionsAppearance(countsOptions, intervalOptions) {
        countsOptions = countsOptions || Settings.StaticItems.RandomAppearance.Counts;
        intervalOptions = intervalOptions || Settings.StaticItems.RandomAppearance.Frequency;

        if (staticModels.getAllPlayerProvisions().length >= Settings.StaticItems.MaxAllowedNumberOfItems){
            stopFutureCalls(activeTimeouts);
            return;
        }

        var loopId = setInterval(function () {
            var timeoutH = setTimeout(function () {
                var rnd = getRandomInt(countsOptions.MaxHealthKits);
                modelsCntrl.addStaticObjectsToGame(rnd, 'health');
            }, getRandomInt(intervalOptions.TimeoutInterval));
            activeTimeouts.push(timeoutH);
            var timeoutAB = setTimeout(function () {
                var rnd = getRandomInt(countsOptions.MaxAmmoBags);
                modelsCntrl.addStaticObjectsToGame(rnd, 'ammoBag');
            }, getRandomInt(intervalOptions.TimeoutInterval));
            activeTimeouts.push(timeoutAB);
            var timeoutAmmo = setTimeout(function () {
                var rnd = getRandomInt(countsOptions.MaxAmmoKits);
                if (playerModels.weapon.gun.shellsCount < 10) rnd++;
                modelsCntrl.addStaticObjectsToGame(rnd, 'ammo');
            }, getRandomInt(intervalOptions.TimeoutInterval));
            activeTimeouts.push(timeoutAmmo);
            var timeoutSA = setTimeout(function () {
                var rnd = getRandomInt(countsOptions.MaxSilverArmours);
                modelsCntrl.addStaticObjectsToGame(rnd, 'silverArmour');
            }, getRandomInt(intervalOptions.TimeoutInterval));
            activeTimeouts.push(timeoutSA);
            var timeoutGA = setTimeout(function () {
                var rnd = getRandomInt(countsOptions.MaxGoldenArmours);
                modelsCntrl.addStaticObjectsToGame(rnd, 'goldenArmour');
            }, getRandomInt(intervalOptions.TimeoutInterval));
            activeTimeouts.push(timeoutGA);
        }, intervalOptions.InitialFrequency);

        activeLoops.push(loopId);
        return loopId;
    }

    function setUpRandomEnemiesAppearance(interval, maxMummies, maxJinns, maxDemons) {
        interval = interval || Settings.Enemies.RandomAppearance.InitialFrequency;
        maxMummies = maxMummies || Settings.Enemies.RandomAppearance.Counts.MaxMummies;
        maxJinns = maxJinns || Settings.Enemies.RandomAppearance.Counts.MaxJinns;
        maxDemons = maxDemons || Settings.Enemies.RandomAppearance.Counts.MaxDemons;

        var loopId = setInterval(function () {
            var mummiesCount = getRandomInt(maxMummies),
                jinnsCount = getRandomInt(maxJinns),
                demonsCount = getRandomInt(maxDemons);

            clearInterval(timerMummies);
            clearInterval(timerJinns);
            clearInterval(timerDemons);

            var coord = [{y: Settings.General.PlayFieldLength + 20}, {y: -20}, {x: Settings.General.PlayFieldWidth + 20}, {x: - 20} ];

            var mummies = modelsCntrl.addEnemiesToGame(mummiesCount, Settings.Enemies.Mummy, coord[getRandomInt(4)]);
            timerMummies = sendModelsTowardsPlayer(models.getAllMummies(),
                Settings.Enemies.SpeedOptions.MummyTimeToCrossField, Settings.Enemies.Positioning.RadiusMummiesDestinationAroundPlayer);

            var jinns = modelsCntrl.addEnemiesToGame(jinnsCount, Settings.Enemies.Jinn, {x: -50});
            timerJinns = sendModelsTowardsPlayer(models.getAllJinns(),
                Settings.Enemies.SpeedOptions.JinnTimeToCrossField, Settings.Enemies.Positioning.RadiusJinnsDestinationAroundPlace);
            setJinnsShooting(Settings.Enemies.JinnsShootingChance);

            var demons = modelsCntrl.addEnemiesToGame(demonsCount, Settings.Enemies.FireDemon, {x: Settings.General.PlayFieldWidth});
            var options = {
                initialSpeed: Settings.Enemies.SpeedOptions.FireDemonTimeToCrossField,
                acceleration: Settings.Enemies.FireDemonRunAcceleration
            };
            timerDemons = actionController.sendFireDemonsRunning(models.getAllFireDemons(), options);
        }, interval);

        activeLoops.push(loopId);
        return loopId;
    }


    function stopLoops(array) {
        for (var i = 0; i < array.length; i++) {
            var id = array[i];
            clearInterval(id);
        }
    }

    function stopFutureCalls(array) {
        for (var i = 0; i < array.length; i++) {
            var id = array[i];
            clearTimeout(id);
        }
    }

    return {
        sendModelsTowardsPlayer: sendModelsTowardsPlayer,
        setPlayerCollisionDetection: setPlayerCollisionDetection,
        setBlastCollisionDetection: setBlastCollisionDetection,
        setJinnsShooting: setJinnsShooting,
        setBlastsConcentrationDetection: setBlastsConcentrationDetection,
        setPlayerProvisionsAppearance: setPlayerProvisionsAppearance,
        setStaticObjectsCollisionDetection: setStaticObjectsCollisionDetection,
        setUpRandomEnemiesAppearance: setUpRandomEnemiesAppearance
    };

}(modelsController, bgController, modelsService, calculationsService, staticModels));
