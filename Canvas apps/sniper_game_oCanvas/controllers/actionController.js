var actionController = (function(actionService){

    function turnToPoint(model, X, Y){
        var angle = positioningService.getAngle(model.x, model.y, X, Y);
        model.rotateTo(angle + Constants.RotationAngleAdjustment);
    }

    function moveToPoint(model, X, Y, maxTime, sensitivity, maxLength, maxWidth){
        model.stop();
        model.startAnimation();

        if (model.name === 'sniper'){
            gameEngine.setMummiesToFollowPlayerOnStartMove(actionService);
        }

        actionService.triggerActionEventSubscribers(moveToPoint.name, true, model);

        model.animate({
            x: X,
            y: Y
        }, {
            easing: 'linear',
            duration: positioningService.calcSpeedOfTravelInSeconds(X, model.x, Y, model.y, maxTime, sensitivity, maxLength, maxWidth),
            callback: function(){
                model.stopAnimation();
                if (model.name === 'sniper'){
                    gameEngine.setMummiesToFollowPlayerOnDestinationReached(actionService);
                }
                actionService.triggerActionEventSubscribers(moveToPoint.name, false, model);
            }
        });
    }

    function fireOnTarget(playField, model, fireShell, target, blast){
        var angle = positioningService.getAngle(model.x, model.y, target.x, target.y);
        fireShell.rotateTo(angle + Constants.RotationAngleAdjustment);

        // position gun shell in front of model
        fireShell.x = angle < -90 ? model.x - 40 : angle > 90 ? model.x - 40 : model.x + 30;
        fireShell.y = angle < 0 ? model.y - 40 : model.y + 30;

        var newFireShell = fireShell.clone();
        playField.addChild(newFireShell);
        fireShell.x = -Constants.PlayFieldWidth; // hide from screen

        newFireShell.startAnimation();

        newFireShell.animate({
            x: target.x,
            y: target.y
        }, {
            easing: 'linear',
            duration: positioningService.calcFireShellTravelDuration(target.x, newFireShell.x, target.y, newFireShell.y),
            callback: function(){
                blast.explode(target);
                playField.removeChild(newFireShell);
            }
        });
    }

    return {
        turnToPoint: turnToPoint,
        moveToPoint: moveToPoint,
        fireOnTarget: fireOnTarget
    }

}(actionEventsService));