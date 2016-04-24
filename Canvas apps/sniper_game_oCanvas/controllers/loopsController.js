var loopsController = (function(modelsCntrl, models, actionService, calculations){

    function sendModelsTowardsPlayer(enemies, speedTime, areaSize){
        enemies = enemies || models.getAllEnemyModels();
        speedTime = speedTime || Settings.DefaultEnemyTimeToCrossField;
        areaSize = areaSize || Settings.RadiusEnemiesDestinationAroundPlayer;
        // returns interval Id
        return setInterval(function(){
            var shooter = models.getOriginalShooter();
            console.log('in sendModelsTowardsPlayer');
            for (var i = 0; i < enemies.length; i++) {
                var rndPlace = models.getRandomCoordinatesAroundPlace(shooter, areaSize);
                actionController.moveToPoint(enemies[i], rndPlace.x, rndPlace.y, speedTime);
            }
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
        return setInterval(function(){
            //logger.monitorBlastsDetection(blasts, victims, tolerance);
            for (var i = 0; i < victims.length; i++) {
                var potentialVictim = victims[i];
                for (var j = 0; j < blasts.length; j++) {
                    var blast = blasts[j];
                    if(calculations.isHit(potentialVictim, blast, tolerance) && !models.isDead(potentialVictim)){
                        var damage = calculations.calculateDamage(potentialVictim, blast, tolerance);
                        modelsCntrl.updateModelHealth(potentialVictim, damage, true);
                    }
                }
            }
        }, Settings.DetectBlastDamageRefreshTime);
    }

    function setPlayerCollisionDetection(others, tolerance){
        return setInterval(function(){
            var player = models.getOriginalShooter();
            others = others || models.getAllEnemyModels();
            tolerance = tolerance || Settings.PlayerCollisionTolerance;
            var hitValue = models.detectManyToOneCollision(player, others, tolerance);
            if(hitValue){
                updateModelState(player, hitValue);
            }
        }, Settings.DetectPlayerCollisionRefreshTime);
    }

    function stopLoopIfNoObjectsOnField(loopId, objType){
        if (models.getModelsByName(objType).length <= 2){
            console.log('rockets: ' + models.getModelsByName(objType).length);
            clearInterval(loopId);
        }
    }

    return {
        sendModelsTowardsPlayer: sendModelsTowardsPlayer,
        setPlayerCollisionDetection: setPlayerCollisionDetection,
        setBlastCollisionDetection: setBlastCollisionDetection
    };

}(modelsController, modelsService, actionEventsService, calculationsService));