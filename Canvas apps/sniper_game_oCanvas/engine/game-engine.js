var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl){

    function startGame(){
        //modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.InitialEnemyType);
        //
        //actionCntrl.sendModelsTowardsPlayer();
        //actionCntrl.setPlayerCollisionDetection();

        var jinns = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.SecondaryEnemyType);
        loopsCntrl.sendModelsTowardsPlayer(jinns, Settings.JinnTimeToCrossField);
        //actionCntrl.setPlayerCollisionDetection(jinns);
    }



    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController));