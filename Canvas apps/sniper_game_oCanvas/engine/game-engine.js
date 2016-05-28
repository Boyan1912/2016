var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl, gameCntrl){

    function startGame(){
      // gameCntrl.playMusic();

      var mummies = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.InitialEnemyType);
      loopsCntrl.sendModelsTowardsPlayer(mummies,
          Settings.MummyTimeToCrossField, Settings.RadiusMummiesDestinationAroundPlayer);

      var jinns = modelsCntrl.addEnemiesToGame(Settings.InitialEnemiesCount, Settings.SecondaryEnemyType);
      loopsCntrl.sendModelsTowardsPlayer(jinns,
          Settings.JinnTimeToCrossField, Settings.RadiusJinnsDestinationAroundPlace);
      loopsCntrl.setJinnsShooting(Settings.JinnsShootingChance);

      // testing
      var demons = modelsCntrl.addEnemiesToGame(2, 'fire_demon', {x: Settings.PlayFieldWidth});
      actionCntrl.sendFireDemonsRunning();

      // var fires = modelsCntrl.addEnemiesToGame(2, 'fire');
      // loopsCntrl.sendModelsTowardsPlayer(fires,
      //     Settings.FireTimeToCrossField, 0);

      loopsCntrl.setPlayerCollisionDetection();
      loopsCntrl.setBlastCollisionDetection();
    }



    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController, gameController));
