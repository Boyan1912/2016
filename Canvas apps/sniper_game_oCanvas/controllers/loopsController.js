var loopsController = (function(modelsCntrl, models, calculations, staticModels){
    
    function sendModelsTowardsPlayer(enemies, speedTime, areaSize, refreshRate){
        enemies = enemies || models.getAllEnemyModels();
        speedTime = speedTime || Settings.DefaultEnemyTimeToCrossField;
        areaSize = areaSize || Settings.DefaultRadius;
        refreshRate = refreshRate || Settings.TravelDirectionRefreshTime;
        // returns interval Id
        var loopId = setInterval(function(){

            for (var i = 0; i < enemies.length; i++) {
              var shooter = models.getShooterFromField();
              var enemy = enemies[i];
              var place = enemy.name === 'jinn' ? Settings.JinnsAboutPlace : shooter;
              var rndPlace = models.getRandomCoordinatesAroundPlace(place, areaSize);
              actionController.moveToPoint(enemy, rndPlace.x, rndPlace.y, speedTime);
            }

        }, refreshRate);
    }

    function setJinnsShooting(frequency){
        var loopId = setInterval(function(){
            var jinns = models.getAllJinns();
            for (var i = 0; i < jinns.length; i++) {
                var jinn = jinns[i],
                    player = models.getShooterFromField(),
                    fires = Math.random() < frequency;
                if(fires){
                  jinn.shoot(models.getRandomCoordinatesAroundPlace(player, Settings.JinnsShotAroundPlace));
                }
            }

            var loopingObjectsCount = getActiveLoopingObjects(jinns).length;
            var loopDetails = {
                loopingObjectsCount: loopingObjectsCount,
                loopId: loopId
            };

        }, Settings.JinnsShootingAttemptFrequency);
    }

    function setBlastCollisionDetection(tolerance){
        var loopId = setInterval(function(){
            var blasts = models.getAllActiveExplosions(),
            victims = models.getAllDamageableModels();
            tolerance = tolerance || Settings.DefaultExplosionDamageArea;

            for (var i = 0; i < victims.length; i++) {
                var potentialVictim = victims[i];
                var damage = calculations.detectManyToOneCollision(potentialVictim, blasts, tolerance);
                if(damage){
                    modelsCntrl.updateModelHealth(potentialVictim, damage);
                }
            }

            if (models.megaDeathCaused()){
                modelsCntrl.updateModelHealth(models.getShooterFromField(), { bonus: Settings.BonusForMegadeath});
                soundsController.playSoundOnMegaDeath();
            }

        }, Settings.DetectBlastDamageRefreshTime);
    }

    function setBlastsConcentrationDetection(tolerance, options){
      options = options || {};
      options.countInflamables = options.countInflamables || Settings.MinCountInflamablesOnField;
      options.maxNumberFires = options.maxNumberFires || Settings.MaxNumberOfFiresPossible;

      var loopId = setInterval(function(){
          var blasts = models.getAllActiveAndPotentialExplosions();
          tolerance = tolerance || Settings.DefaultExplosionDamageArea;

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
      }, Settings.DetectFireIgnitionRefreshTime);
    }

    function lightFires(options){
      options = options || {};
      options.minDamage = options.minDamage || Settings.MinDamageCausedToIgnite;
      options.radius = options.radius || Settings.BurningRadius;
      options.speedOfFire = options.speedOfFire || Settings.FireTimeToCrossField;
      options.burnDuration = options.burnDuration || Settings.MinBurningTime;
      options.countNewFires = options.countNewFires || Settings.DefaultNumberNewFiresToAdd;
      options.fireType = options.fireType || Settings.DefaultFireType;

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

    function setPlayerCollisionDetection(others, tolerance){
        var loopId = setInterval(function(){
            others = others || models.getAllEnemyModels();
            tolerance = tolerance || Settings.PlayerCollisionTolerance;

            var player = models.getShooterFromField();
            var damage = calculations.detectManyToOneCollision(player, others, tolerance);
            if(damage){
                modelsCntrl.updateModelHealth(player, damage);
            }

        }, Settings.DetectPlayerCollisionRefreshTime);
    }

    function setStaticObjectsCollisionDetection(staticObjects, tolerance) {
        var loopId = setInterval(function(){
            staticObjects = staticObjects || staticModels.getAllStaticItems();
            tolerance = tolerance || Settings.PlayerCollisionTolerance;

            var player = models.getShooterFromField();

            var staticObjectType = calculations.detectManyToOneCollision(player, staticObjects, tolerance);
            if(staticObjectType){
                modelsCntrl.updatePlayerAttributes(player, staticObjectType);
                staticObjectType.disappear();
            }

        }, Settings.DetectStaticObjectsCollisionRefreshTime);
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
    
    function setRemovalOfUnwantedObjects() {
        var loopId = setInterval(function(){

            let trash = models.getAllDead();
            console.log(trash);
            for (var i = 0; i < trash.length; i++) {
                var junk = trash[i];
                junk.remove();
            }
        }, 100);
    }
    
    return {
        sendModelsTowardsPlayer: sendModelsTowardsPlayer,
        setPlayerCollisionDetection: setPlayerCollisionDetection,
        setBlastCollisionDetection: setBlastCollisionDetection,
        setJinnsShooting: setJinnsShooting,
        setBlastsConcentrationDetection: setBlastsConcentrationDetection,
        // setRemovalOfUnwantedObjects: setRemovalOfUnwantedObjects,
        setStaticObjectsCollisionDetection: setStaticObjectsCollisionDetection
    };

}(modelsController, modelsService, calculationsService, staticModels));
