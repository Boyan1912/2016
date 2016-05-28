var loopsController = (function(modelsCntrl, models, calculations){
    function sendModelsTowardsPlayer(enemies, speedTime, areaSize){
        enemies = enemies || models.getAllEnemyModels();
        speedTime = speedTime || Settings.DefaultEnemyTimeToCrossField;
        areaSize = areaSize || Settings.DefaultRadius;
        // returns interval Id
        var loopId = setInterval(function(){

            for (var i = 0; i < enemies.length; i++) {
              var shooter = models.getShooterFromField();
              var enemy = enemies[i];
              var place = enemy.name === 'jinn' ? Settings.JinnsAboutPlace : shooter;
              var rndPlace = models.getRandomCoordinatesAroundPlace(place, areaSize);

              actionController.moveToPoint(enemy, rndPlace.x, rndPlace.y, speedTime);
            }

            var loopingObjectsCount = getActiveLoopingObjects(enemies).length;
            var loopDetails = {
                loopingObjectsCount: loopingObjectsCount,
                loopId: loopId
            };

            stopLoopIfNotNeeded(loopDetails);
        }, Settings.TravelDirectionRefreshTime);
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

            stopLoopIfNotNeeded(loopDetails);
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
                    // console.log(potentialVictim.health);
                }
            }
            var loopingObjectsCount = getActiveLoopingObjects(blasts).length;
            var loopDetails = {
                loopingObjectsCount: loopingObjectsCount,
                loopId: loopId
            };

            // stopLoopIfNotNeeded(loopDetails);
        }, Settings.DetectBlastDamageRefreshTime);
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

            var loopingObjectsCount = getActiveLoopingObjects(others).length;
            var loopDetails = {
                loopingObjectsCount: loopingObjectsCount,
                loopId: loopId
            };
            // stopLoopIfNotNeeded(loopDetails);
        }, Settings.DetectPlayerCollisionRefreshTime);
    }

    function stopLoopIfNotNeeded(loopDetails){
        if(loopDetails.loopingObjectsCount < 1){
            clearInterval(loopDetails.loopId);
        }
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

    return {
        sendModelsTowardsPlayer: sendModelsTowardsPlayer,
        setPlayerCollisionDetection: setPlayerCollisionDetection,
        setBlastCollisionDetection: setBlastCollisionDetection,
        setJinnsShooting: setJinnsShooting
    };

}(modelsController, modelsService, calculationsService));
