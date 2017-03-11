var gameEngine = (function(modelsCntrl, actionCntrl, loopsCntrl, gameCntrl, difficultyCntrl, bgCntrl){
    var start;
    var milisecToNextLevel = 120 * 1000;

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
                difficultyCntrl.changeJinnsShootingFrequency(0.1);
            }
        }, Settings.GamePerformance.UpdatePlayDurationInterval)
    }

    function startGame(){
        start = new Date();
        controlGamePlay();
        initGamePlay();
        bgCntrl.optimizePerformance();
        bgCntrl.changeVideoBgFading(0, 0);

        $('#btnMusic').on('click', function (e) {
            bgCntrl.changeVideoBgFading();
        });
    }

    function initGamePlay() {
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
