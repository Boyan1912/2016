var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl, gameCntrl){

    function startGame(){
      gameCntrl.playMusic();

      var mummies = modelsCntrl.addEnemiesToGame(0, Settings.InitialEnemyType, {y: -50});
      loopsCntrl.sendModelsTowardsPlayer(mummies,
          Settings.MummyTimeToCrossField, Settings.RadiusMummiesDestinationAroundPlayer);

      var jinns = modelsCntrl.addEnemiesToGame(0, Settings.SecondaryEnemyType, {x: -50});
      loopsCntrl.sendModelsTowardsPlayer(jinns,
          Settings.JinnTimeToCrossField, Settings.RadiusJinnsDestinationAroundPlace);
      loopsCntrl.setJinnsShooting(Settings.JinnsShootingChance);

      var demons = modelsCntrl.addEnemiesToGame(2, Settings.ThirtiaryEnemyType, {x: Settings.PlayFieldWidth});
      var options = {
          initialSpeed: Settings.FireDemonTimeToCrossField,
          acceleration: Settings.FireDemonRunAcceleration
      };
      actionCntrl.sendFireDemonsRunning(demons, options);

      loopsCntrl.setBlastsConcentrationDetection();
      loopsCntrl.setPlayerCollisionDetection();
      loopsCntrl.setBlastCollisionDetection();
        
        setTimeout(function () {
            modelsCntrl.addEnemiesToGame(2, 'health_kit');
        }, 2000);
    }



    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController, gameController));
