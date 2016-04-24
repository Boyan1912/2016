var enemyModels = (function(field){

    var creatures = (function (){

        var mummy = field.display.sprite({
            x: 10,
            y: -10,
            origin: { x: "center", y: "center" },
            image: "img/mummy.png",
            generate: true,
            width: 40,
            height: 58,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'mummy',
            health: Settings.DefaultInitialEnemyHealth,
            damageWeight: Settings.DefaultInitialMummyDamageWeight,
            killValuePoints: Settings.MummyKillValuePoints
        });

        mummy.id = 0;
        field.addChild(mummy);

        var jinn = field.display.sprite({
            x: 50,
            y: -20,
            origin: { x: "center", y: "center" },
            image: "img/jinn.png",
            generate: true,
            width: 60,
            height: 56,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'jinn',
            health: Settings.DefaultInitialEnemyHealth,
            damageWeight: Settings.DefaultInitialJinnDamageWeight,
            killValuePoints: Settings.JinnKillValuePoints
        });

        jinn.id = -1;
        field.addChild(jinn);


        return {
            mummy: mummy,
            jinn: jinn
        };

    }());

    return {
        creatures: creatures
    }

}(gameController.playField));