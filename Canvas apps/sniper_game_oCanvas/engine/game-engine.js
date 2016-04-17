var gameEngine = (function(field, enemies, actionCntrl){

    function getAllCanvasElements(){
        return field.children;
    }

    function getAllMummies(){
        return getAllCanvasElements().filter(function(model){
            return model.name === 'mummy';
        })
    }

    function addMummiesToGame(count, settings){
        var mummies = enemies.addMummies(count, settings);
        for (var i = 0; i < mummies.length; i++) {
            field.addChild(mummies[i]);
        }
    }

    function getShooterFromField(){
        return getAllCanvasElements().find(function(model){
            return model.name === 'sniper';
        })
    }

    function setMummiesToFollowPlayerOnStartMove(actionService){
        var mummies = getAllMummies();
        var shooter = getShooterFromField();
        for (var i = 0; i < mummies.length; i++) {
            actionService.addSubscriberToActionEvent('moveToPoint', true, actionCntrl.moveToPoint,
                [mummies[i], shooter.x, shooter.y, Constants.MummyTimeToCrossField], shooter);
        }
    }

    function setMummiesToFollowPlayerOnDestinationReached(actionService){
        var mummies = getAllMummies();
        var shooter = getShooterFromField();
        for (var i = 0; i < mummies.length; i++) {
            actionService.addSubscriberToActionEvent('moveToPoint', false, actionCntrl.moveToPoint,
                [mummies[i], shooter.x, shooter.y, Constants.MummyTimeToCrossField], shooter);
        }
    }

    function detectPlayerCollision(){
        field.setLoop(function(){
            var player = getShooterFromField();
            var enemies = getAllMummies();
            var collided = collisionDetectionService.detectCollision(player, enemies);
            console.log(collided);
        }).start();
    }

    function getRocketsFromField(){
        return getAllCanvasElements().filter(function(model){
            return model.name === 'rocket';
        })
    }
    
    function detectRocketsCollision(){
        field.setLoop(function(){
            var rockets = getRocketsFromField();
            var enemies = getAllMummies();
            for (var i = 0; i < rockets.length; i++) {
                var obj = rockets[i];
                
            }
            console.log(collided);
        }).start();
    }
    
    return {
        addMummiesToGame: addMummiesToGame,
        setMummiesToFollowPlayerOnStartMove: setMummiesToFollowPlayerOnStartMove,
        setMummiesToFollowPlayerOnDestinationReached: setMummiesToFollowPlayerOnDestinationReached,
        detectPlayerCollision: detectPlayerCollision
    }

}(gameController.playField, enemyModelsService, actionController));