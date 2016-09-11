var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl, gameCntrl, difficultyCntrl, bgCntrl){
    var start;
    var milisecToNextLevel = 10 * 1000;

    function controlGamePlay() {
        setInterval(function () {
            var duration = Math.abs(new Date() - start);
            if (duration > milisecToNextLevel){
                console.log('level reached');
                start = new Date();
                difficultyCntrl.changeDifficultyLevel(0.001, 0.001);
                difficultyCntrl.changeRandomEnemiesCountAppearance(0.03);
                difficultyCntrl.changeRandomProvisionsCountAppearance(0.1);
                difficultyCntrl.changeRandomProvisionsFrequencyAppearance(-0.1);
                difficultyCntrl.changeEnemiesDamage(0.1);
                difficultyCntrl.changeEnemiesSpeed(0.1);

                // if (Settings.GamePerformance.Constraints.MaxLoopingObjectsAllowedToDisplayBackground > 9)
                //     Settings.GamePerformance.Constraints.MaxLoopingObjectsAllowedToDisplayBackground -= 1;
            }
        }, Settings.GamePerformance.UpdatePlayDurationInterval)
    }

    function startGame(){
        start = new Date();
        controlGamePlay();

        // bgCntrl.animateBg('shake');
        // bgCntrl.changeBgRandomly();
        bgCntrl.optimizePerformance();
        loopsCntrl.setUpRandomEnemiesAppearance();
        loopsCntrl.setPlayerCollisionDetection();
        loopsCntrl.setBlastsConcentrationDetection();
        loopsCntrl.setBlastCollisionDetection();
        loopsCntrl.setPlayerProvisionsAppearance();
        loopsCntrl.setStaticObjectsCollisionDetection();

        $('#btnMusic').on('click', function (e) {
            // var index = getRandomInt(AnimationTypes.length);
            // var index2 = index;
            // var animIn = AnimationTypes[index];
            // var animOut = AnimationTypes[index];
            //
            // while (!animIn.indexOf('In') < 0){
            //     index = index < 1 ? AnimationTypes.length - 1 : index;
            //     animIn = AnimationTypes[index];
            // }
            // while (!animOut.indexOf('Out') < 0){
            //     index2 = index2 >= AnimationTypes.length ? 0 : index2 + 1;
            //     animIn = AnimationTypes[index2];
            // }
            bgCntrl.changeBgRandomly(true, true);
        });
    }


    return {
        startGame: startGame
    }

}(modelsController, actionController, loopsController, gameController, difficultyController, bgController));
