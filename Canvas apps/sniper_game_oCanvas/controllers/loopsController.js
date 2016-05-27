var loopsController = (function(modelsCntrl, models, calculations){

    function sendModelsTowardsPlayer(enemies, speedTime, areaSize){
        enemies = enemies || models.getAllEnemyModels();
        speedTime = speedTime || Settings.DefaultEnemyTimeToCrossField;
        areaSize = areaSize || Settings.RadiusJinnsDestinationAroundPlace;
        // returns interval Id
        var loopId = setInterval(function(){
            var shooter = models.getShooterFromField();

            for (var i = 0; i < enemies.length; i++) {
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

    function setJinnsShooting(){
        var loopId = setInterval(function(){
            var jinns = models.getAllJinns();

            for (var i = 0; i < jinns.length; i++) {
                var jinn = jinns[i];
                var player = models.getShooterFromField();

                if (jinn.frame > 3 && jinn.frame < 6){
                    jinn.shoot(models.getRandomCoordinatesAroundPlace(player, Settings.JinnsShotAroundPlace));    
                }
                // var shootingInterval = Settings.JinnsShootingFrequency / jinns.length;
                // setTimeout(function(){
                //     jinn.shoot(models.getRandomCoordinatesAroundPlace(player, Settings.JinnsShotAroundPlace));
                // }, parseInt(shootingInterval))

            }
            var loopingObjectsCount = getActiveLoopingObjects(jinns).length;
            var loopDetails = {
                loopingObjectsCount: loopingObjectsCount,
                loopId: loopId
            };

            stopLoopIfNotNeeded(loopDetails);
        }, Settings.JinnsShootingFrequency);
    }

    function setBlastCollisionDetection(blasts, victims, tolerance){
        var loopId = setInterval(function(){
            //logger.monitorBlastsDetection(blasts, victims, tolerance);
            for (var i = 0; i < victims.length; i++) {
                var potentialVictim = victims[i];
                for (var j = 0; j < blasts.length; j++) {
                    var blast = blasts[j];
                    if(calculations.isHit(potentialVictim, blast, tolerance) && !models.isDead(potentialVictim)){
                        var damage = calculations.calculateDamage(potentialVictim, blast, tolerance);
                        modelsCntrl.updateModelHealth(potentialVictim, damage);
                    }
                }
            }
            var loopingObjectsCount = getActiveLoopingObjects(blasts).length;
            var loopDetails = {
                loopingObjectsCount: loopingObjectsCount,
                loopId: loopId
            };

            stopLoopIfNotNeeded(loopDetails);
        }, Settings.DetectBlastDamageRefreshTime);
    }

    function setPlayerCollisionDetection(others, tolerance){
        var loopId = setInterval(function(){
            var player = models.getShooterFromField();
            others = others || models.getAllEnemyModels();
            tolerance = tolerance || Settings.PlayerCollisionTolerance;
            var damage = calculations.detectManyToOneCollision(player, others, tolerance);
            if(damage){
                modelsCntrl.updateModelHealth(player, damage);
            }

            var loopingObjectsCount = getActiveLoopingObjects(others).length;
            var loopDetails = {
                loopingObjectsCount: loopingObjectsCount,
                loopId: loopId
            };
            stopLoopIfNotNeeded(loopDetails);
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