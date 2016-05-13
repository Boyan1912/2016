var loopsController = (function(modelsCntrl, models, calculations){

    function sendModelsTowardsPlayer(enemies, speedTime, areaSize){
        enemies = enemies || models.getAllEnemyModels();
        speedTime = speedTime || Settings.DefaultEnemyTimeToCrossField;
        areaSize = areaSize || Settings.RadiusJinnsDestinationAroundPlayer;
        // returns interval Id
        var loopId = setInterval(function(){
            var shooter = models.getOriginalShooter();

            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                var rndPlace = models.getRandomCoordinatesAroundPlace(shooter, areaSize);
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

    //function setRocketCollisionDetection(fireShell, others, tolerance){
    //    return setInterval(function(){
    //        console.log('in rocket collision detection');
    //        var hitObjects = models.getHitObjects(fireShell, others, tolerance);
    //        for (var i = 0; i < hitObjects.length; i++) {
    //            var obj = hitObjects[i];
    //            console.log('damage: ' + obj.damaged);
    //            updateModelState(obj, obj.damaged);
    //        }
    //    }, Settings.DetectBlastDamageRefreshTime);
    //}

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
            var player = models.getOriginalShooter();
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
    };

}(modelsController, modelsService, calculationsService));