var difficultyController = (function (actionCntrl, loopsCntrl) {

    var timerAddRandomModels,
        timerPlayerProvisions;

    function changeDifficultyLevel(speedIncrease, damageIncrease) {
        changeEnemiesSpeed(speedIncrease);
        changeEnemiesDamage(damageIncrease);
    }

    function changeEnemiesSpeed(coef) {
        var speedOptions = Settings.Enemies.SpeedOptions;
        decreaseOptionsValues(speedOptions, coef);
    }

    function changeEnemiesDamage(coef) {
        var damageOptions = Settings.Enemies.Damage;
        incrementOptionsValues(damageOptions, coef);
    }

    function incrementOptionsValues(options, coef) {
        if (Array.isArray(options)){
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                option = option + option * coef;
            }
        } else if (typeof options == 'object') {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    options[key] = options[key] + options[key] * coef;
                }
            }
        }
    }

    function decreaseOptionsValues(options, coef) {
        if (Array.isArray(options)) {
            for (var i = 0; i < options.length; i++) {
                var option = options[i];
                option = option - option * coef;
            }
        } else if (typeof options == 'object') {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    options[key] = options[key] - options[key] * coef;
                }
            }
        }
    }

    function changeRandomEnemiesCountAppearance(coef) {
        var countsOptions = Settings.Enemies.RandomAppearance.Counts;
        incrementOptionsValues(countsOptions, coef);
    }

    function changeRandomEnemiesFrequencyAppearance(coef) {
        clearInterval(timerAddRandomModels);
        var frequencyOption = Settings.Enemies.RandomAppearance.InitialFrequency;
        Settings.Enemies.RandomAppearance.InitialFrequency = frequencyOption + frequencyOption * coef;
        timerAddRandomModels = loopsCntrl.setUpRandomEnemiesAppearance();
    }


    function changeRandomProvisionsCountAppearance(coef) {
        var defaultOptions = Settings.StaticItems.RandomAppearance.Counts;
        incrementOptionsValues(defaultOptions, coef);
    }

    function changeRandomProvisionsFrequencyAppearance(coef) {
        clearInterval(timerPlayerProvisions);
        var defaultOptions = Settings.StaticItems.RandomAppearance.Frequency;
        incrementOptionsValues(defaultOptions, coef);
        timerPlayerProvisions = loopsCntrl.setPlayerProvisionsAppearance();
    }

    function changeJinnsShootingFrequency(coef) {
        Settings.Enemies.JinnsShootingChance = Settings.Enemies.JinnsShootingChance + Settings.Enemies.JinnsShootingChance * coef;
    }
    
    return {
        changeRandomEnemiesFrequencyAppearance: changeRandomEnemiesFrequencyAppearance,
        changeDifficultyLevel: changeDifficultyLevel,
        changeRandomProvisionsFrequencyAppearance: changeRandomProvisionsFrequencyAppearance,
        changeRandomProvisionsCountAppearance: changeRandomProvisionsCountAppearance,
        changeRandomEnemiesCountAppearance: changeRandomEnemiesCountAppearance,
        changeJinnsShootingFrequency: changeJinnsShootingFrequency,
        changeEnemiesSpeed: changeEnemiesSpeed,
        changeEnemiesDamage: changeEnemiesDamage
    }

}(actionController, loopsController));