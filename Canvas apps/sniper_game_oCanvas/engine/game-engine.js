var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl){

    function startGame(){
        var mummies = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.InitialEnemyType);
        loopsCntrl.sendModelsTowardsPlayer(mummies, Settings.JinnTimeToCrossField);

        var jinns = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.SecondaryEnemyType);
        loopsCntrl.sendModelsTowardsPlayer(jinns, Settings.JinnTimeToCrossField);
        loopsCntrl.setPlayerCollisionDetection();
    }



    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController));