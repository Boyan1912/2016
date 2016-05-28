var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl, gameCntrl){

    function startGame(){
      gameCntrl.playMusic();

      var mummies = modelsCntrl.addEnemiesToGame(5, Settings.InitialEnemyType);
      loopsCntrl.sendModelsTowardsPlayer(mummies,
          Settings.MummyTimeToCrossField, Settings.RadiusMummiesDestinationAroundPlayer);

      var jinns = modelsCntrl.addEnemiesToGame(1, Settings.SecondaryEnemyType);
      loopsCntrl.sendModelsTowardsPlayer(jinns,
          Settings.JinnTimeToCrossField, Settings.RadiusJinnsDestinationAroundPlace);
      loopsCntrl.setJinnsShooting(Settings.JinnsShootingChance);

      var demons = modelsCntrl.addEnemiesToGame(2, Settings.ThirtiaryEnemyType, {x: Settings.PlayFieldWidth});
      actionCntrl.sendFireDemonsRunning(Settings.InitialFireDemonTimeToCrossField, Settings.FireDemonRunAcceleration);

      loopsCntrl.setBlastsConcentrationDetection();
      loopsCntrl.setPlayerCollisionDetection();
      loopsCntrl.setBlastCollisionDetection();
    }



    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController, gameController));
