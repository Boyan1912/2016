var actionController = (function(field, loopsCntrl, calculations, models){

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

        gunShell.startAnimation();
        gunShell.animate({
            x: target.x,
            y: target.y
        }, {
            easing: 'linear',
            duration: calculations.calcSpeedOfTravelInSeconds(target.x, gunShell.x, target.y, gunShell.y, Settings.MaxTimeForRocketToCrossField),
            callback: function(){

                blast.explode(target);

                var allExplosions = models.getAllActiveExplosions();

                loopsCntrl.setBlastCollisionDetection(allExplosions,
                    models.getAllDamageableModels(), Settings.DefaultExplosionDamageArea);

                field.removeChild(gunShell);
            }
        });
    }


    return {
        turnToPoint: turnToPoint,
        moveToPoint: moveToPoint,
        fireOnTarget: fireOnTarget
    }

}(gameController.playField, loopsController, calculationsService, modelsService));