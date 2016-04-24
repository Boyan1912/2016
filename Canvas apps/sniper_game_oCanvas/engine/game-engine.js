var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl){

    function startGame(){
        var mummies = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.InitialEnemyType);
        loopsCntrl.sendModelsTowardsPlayer(mummies,
            Settings.MummyTimeToCrossField, Settings.RadiusMummiesDestinationAroundPlayer);

        var jinns = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.SecondaryEnemyType);
        loopsCntrl.sendModelsTowardsPlayer(jinns,
            Settings.JinnTimeToCrossField, Settings.RadiusJinnsDestinationAroundPlayer);
        var playerDamageTrackingLoopId = loopsCntrl.setPlayerCollisionDetection();
    }



    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController));