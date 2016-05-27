var actionController = (function(field, loopsCntrl, calculations, models){

    function turnToPoint(model, X, Y){
        var angle = calculations.getAngle(model.x, model.y, X, Y);

        if(model.name === 'sniper'){
            angle += Settings.RotationAngleAdjustment;
        }

        model.rotateTo(angle);
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

    function fireOnTarget(model, target, gun, blast, speed){
        var angle = calculations.getAngle(model.x, model.y, target.x, target.y);

        gun.rotateTo(angle + Settings.RotationAngleAdjustment);
        
        if(model.name === 'sniper'){
            calculations.positionWeaponInFrontOfModel(gun, model, angle);
        }else if(model.name === 'jinn'){
            gun.x = model.x;
            gun.y = model.y;
        }

        var gunShell = models.cloneModel({x: gun.x, y: gun.y}, gun);
        field.addChild(gunShell);
        gun.x = -Settings.PlayFieldWidth; // hide from screen
        // gun.shellsCount--;

        gunShell.playSound();
        gunShell.startAnimation();
        gunShell.animate({
            x: target.x,
            y: target.y
        }, {
            easing: 'linear',
            duration: calculations.calcSpeedOfTravelInSeconds(target.x, gunShell.x, target.y, gunShell.y, speed),
            callback: function(){

                blast.explode(target);

                var allExplosions = models.getAllActiveExplosions();

                loopsCntrl.setBlastCollisionDetection(allExplosions,
                    models.getAllDamageableModels(), Settings.DefaultExplosionDamageArea);

                field.removeChild(gunShell);
            }
        });
    }

    function explode(model, target, sound, duration){
            var clone = models.cloneModel({ x: target.x, y: target.y }, model);
            field.addChild(clone);
            clone.startAnimation();
            if(sound){  
                sound.play(); 
            }
            setTimeout(function(){
                clone.remove();
            }, duration);
        }


    return {
        turnToPoint: turnToPoint,
        moveToPoint: moveToPoint,
        fireOnTarget: fireOnTarget,
        explode: explode
    }

}(gameController.playField, loopsController, calculationsService, modelsService));