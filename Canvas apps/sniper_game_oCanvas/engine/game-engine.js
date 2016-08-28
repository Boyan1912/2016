var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl, gameCntrl, difficultyCntrl, bgCntrl){
    var start;
    var milisecToNextLevel = 10 * 1000;

    function controlGamePlay() {
        setInterval(function () {
            var duration = Math.abs(new Date() - start);
            if (duration > milisecToNextLevel){
                console.log('level reached');
                start = new Date();
                // difficultyCntrl.changeDifficultyLevel(-0.01, 0.01);
                // difficultyCntrl.changeRandomEnemiesCountAppearance(0.2);
                bgCntrl.stopBgAnim();
                difficultyCntrl.changeRandomProvisionsCountAppearance(0.1);
                difficultyCntrl.changeRandomProvisionsFrequencyAppearance(-0.1);
                difficultyCntrl.changeEnemiesDamage(0.1);
                difficultyCntrl.changeEnemiesSpeed(0.1);
            }
        }, Settings.GamePerformance.UpdatePlayDurationInterval)
    }

    function startGame(){
        start = new Date();
        controlGamePlay();

        // testing
        // bgCntrl.changeBgVideoAnimated(undefined, AnimationTypes[getRandomInt(AnimationTypes.types.length)], AnimationTypes[getRandomInt(AnimationTypes.types.length)]);

        bgCntrl.optimizePerformance();
        loopsCntrl.setUpRandomEnemiesAppearance();
        loopsCntrl.setPlayerCollisionDetection();
        loopsCntrl.setBlastsConcentrationDetection();
        loopsCntrl.setBlastCollisionDetection();
        loopsCntrl.setPlayerProvisionsAppearance();
        loopsCntrl.setStaticObjectsCollisionDetection();


    }


    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController, gameController, difficultyController, bgController));
