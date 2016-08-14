var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl, gameCntrl, staticItems){

    function startGame(){
      gameCntrl.playMusic();

      var mummies = modelsCntrl.addEnemiesToGame(5, Settings.InitialEnemyType, {y: -50});
      loopsCntrl.sendModelsTowardsPlayer(mummies,
          Settings.MummyTimeToCrossField, Settings.RadiusMummiesDestinationAroundPlayer);

      var jinns = modelsCntrl.addEnemiesToGame(1, Settings.SecondaryEnemyType, {x: -50});
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
      loopsCntrl.setStaticObjectsCollisionDetection();


      setTimeout(function () {
          staticItems.addStaticObject('firstAidKit');
      }, 2000);

      loopsCntrl.setRemovalOfUnwantedObjects();
    }



    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController, gameController, staticModels));
