var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl){
    var tempo = 1;
    function startGame(){
        var mummies = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.InitialEnemyType);
        loopsCntrl.sendModelsTowardsPlayer(mummies,
            Settings.MummyTimeToCrossField, Settings.RadiusMummiesDestinationAroundPlayer);

        var jinns = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.SecondaryEnemyType);
        loopsCntrl.sendModelsTowardsPlayer(jinns,
            Settings.JinnTimeToCrossField, Settings.RadiusJinnsDestinationAroundPlace);
        loopsCntrl.setJinnsShooting();
        loopsCntrl.setPlayerCollisionDetection();


        setTimeout(function(){
            startGame();
        }, 30000 / tempo);

        tempo++;
    }



    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController));