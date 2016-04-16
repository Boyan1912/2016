var gameEngine = (function(field, player, enemies, actionCntrl){

    function getAllCanvasElements(){
        return field.children;
    }

    function getAllMummies(){
        return getAllCanvasElements().filter(function(model){
            return model.name === 'mummy';
        })
    }

    function addMummiesToGame(count){
        enemies.entities.addMummies(count);
    }

    function getShooterFromField(){
        return getAllCanvasElements().find(function(model){
            return model.name === 'sniper';
        })
    }

    function setEnemiesToFollowPlayer(actionService){
        var mummies = getAllMummies();
        var shooter = getShooterFromField();
        for (var i = 0; i < mummies.length; i++) {
            actionService.addSubscriberToActionEvent('moveToPoint', true, actionCntrl.moveToPoint,
                [mummies[i], shooter.x, shooter.y, Constants.MummyTimeToCrossField], shooter);
        }
    }



    return {
        addMummiesToGame : addMummiesToGame,
        setEnemiesToFollowPlayer : setEnemiesToFollowPlayer
    }

}(gameController.playField, playerModels, enemyModels, actionController));