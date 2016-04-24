var actionController = (function(field, calculations, models, actionService){

    function turnToPoint(model, X, Y){
        var angle = calculations.getAngle(model.x, model.y, X, Y);
        model.rotateTo(angle + Settings.RotationAngleAdjustment);
    }

    function moveToPoint(model, X, Y, maxTime, sensitivity, maxLength, maxWidth){
        model.stop();
        model.startAnimation();

        var animationDuration = calculations.calcSpeedOfTravelInSeconds(X, model.x, Y, model.y, maxTime, sensitivity, maxLength, maxWidth);

        model.animate({
            x: X,
            y: Y
        }, {
            easing: 'linear',
            duration: animationDuration,
            callback: function(){
                model.stopAnimation();
                actionService.triggerActionEventSubscribers('moveToPoint', model);
            }
        });
    }

    function fireOnTarget(model, target){
        var angle = calculations.getAngle(model.x, model.y, target.x, target.y),
            gun = models.getOriginalPlayerItem('weapon').gun,
            blast = models.getOriginalPlayerItem('blast');

        gun.rotateTo(angle + Settings.RotationAngleAdjustment);
        calculations.positionWeaponInFrontOfModel(gun, model, angle);

        var gunShell = models.cloneModel({x: gun.x, y: gun.y}, gun);
        field.addChild(gunShell);
        gun.x = -Settings.PlayFieldWidth; // hide from screen
        gun.shellsCount--;

        var loopId = setRocketCollisionDetection(gunShell, models.getAllEnemyModels(), Settings.RocketCollisionTolerance);
        //console.log('loopId: ' + loopId);
        actionService.addSubscriberToActionEvent('fireOnTarget', stopLoopIfNoObjectsOnField, [loopId, gun.name], gunShell);

        gunShell.startAnimation();
        gunShell.animate({
            x: target.x,
            y: target.y
        }, {
            easing: 'linear',
            duration: calculations.calcSpeedOfTravelInSeconds(target.x, gunShell.x, target.y, gunShell.y, Settings.MaxTimeForRocketToCrossField),
            callback: function(){
                blast.explode(target);


                field.removeChild(gunShell);
                //console.log('STOP FUNC ID: ' + loopId);

                setTimeout(function(){
                    clearInterval(loopId);
                }, 2000);
            }
        });
    }

    function sendModelsTowardsPlayer(enemies, speedTime){
        enemies = enemies || models.getAllEnemyModels();
        speedTime = speedTime || Settings.DefaultEnemyTimeToCrossField;
        // returns interval Id
        return setInterval(function(){
            var shooter = models.getOriginalShooter(),
                rememberedSpeed = speedTime;
            for (var i = 0; i < enemies.length; i++) {
                if(models.isDead(enemies[i])){
                    handleDeadEnemyModel(enemies[i]);
                }else if(!models.isViable(enemies[i])){
                    speedTime *= Settings.SlowDownDamagedModelsRate;
                }
                var rndPlace = models.getRandomCoordinatesAroundPlace(shooter, Settings.RadiusEnemiesDestinationAroundPlayer);
                actionService.addSubscriberToActionEvent('moveToPoint', moveToPoint,
                    [enemies[i], rndPlace.x, rndPlace.y, speedTime], shooter);
                speedTime = rememberedSpeed;
            }
            actionService.triggerActionEventSubscribers('moveToPoint', moveToPoint, shooter);
        }, Settings.TravelDirectionRefreshTime);
    }

    function handleDeadEnemyModel(model){
        console.log('DEAD: ' + model.name);
        var player = models.getOriginalShooter();
        player.points += model.killValuePoints;
        //console.log('POINTS: ' + player.points);
        //model.health = Settings.DefaultInitialEnemyHealth;

        model.fadeOut('short', Settings.DefaultModelFadeOutType, function () {
            field.removeChild(model);
            //var newPlace = models.getRandomCoordinatesAroundPlace({x: Settings.PlayFieldWidth / 2, y: 0}, Settings.PlayFieldWidth, Settings.EnemiesShowUpMarginAroundUpperYAxis);
            //model.x = newPlace.x;
            //model.y = newPlace.y;
            //model.health = Settings.DefaultInitialEnemyHealth;
            //model.id = models.getUniqueId();
            //model.fadeIn('short', Settings.DefaultModelFadeInType);
        })
    }

    function setRocketCollisionDetection(fireShell, others, tolerance){
        return setInterval(function(){
            console.log('in rocket collision detection');
            var hitObjects = models.getHitObjects(fireShell, others, tolerance);
            for (var i = 0; i < hitObjects.length; i++) {
                var obj = hitObjects[i];
                console.log('damage: ' + obj.damaged);
                updateModelState(obj, obj.damaged);
            }
        }, Settings.DetectCollisionRefreshTime);
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

    function setRegularUpdateField(interval){
        setInterval(function(){
            actionService.triggerActionEventSubscribers('update');
        }, interval);
    }

    //TODO
    function updateModelState(model, damaged, good){
        //console.log('in updateModelState: model health: ' + model.health + ' damaged: ' + damaged);
        if (damaged){
            model.health -= damaged;
            model.damaged = 0;
            //console.log(model.name + ': id: ' + model.id);
            //console.log(model.health);
        }
        if (model.health < 1 && model.name !== 'sniper'){
            handleDeadEnemyModel(model);
        }
        if (good){
           // add goodies like health and shields
        }
    }

    function stopLoopIfNoObjectsOnField(loopId, objType){
        if (models.getModelsByName(objType).length <= 2){
            console.log('rockets: ' + models.getModelsByName(objType).length);
            clearInterval(loopId);
        }
    }

    return {
        turnToPoint: turnToPoint,
        moveToPoint: moveToPoint,
        fireOnTarget: fireOnTarget,
        updateModelState: updateModelState,
        sendModelsTowardsPlayer: sendModelsTowardsPlayer,
        setRocketCollisionDetection: setRocketCollisionDetection,
        setPlayerCollisionDetection: setPlayerCollisionDetection,
        setRegularUpdateField: setRegularUpdateField
    }

}(gameController.playField, calculationsService, modelsService, actionEventsService));