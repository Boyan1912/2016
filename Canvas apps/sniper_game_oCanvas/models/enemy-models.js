var enemyModels = (function(field, actions){

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
            killValuePoints: Settings.JinnKillValuePoints,
            shoot: function(target){
                actions.fireOnTarget(this, target, jinnBullet, blast, Settings.MaxTimeForJinnBulletToCrossField);
            }
        });

        jinn.id = 0;
        field.addChild(jinn);

        var jinnBullet = field.display.sprite({
            x: 50,
            y: 20,
            origin: { x: "center", y: "center" },
            image: "img/jinnbullet.png",
            generate: true,
            width: 22,
            height: 22,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'jinnBullet',
            damageWeight: Settings.DefaultInitialJinnDamageWeight
            });

            jinnBullet.id = 0;
            field.addChild(jinnBullet);
            

        // NOT DONE!
        var blast = (function(){
            var explosion = field.display.sprite({
            x: -1000,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/explosion3.png",
            generate: true,
            width: 64,
            height: 62,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            frame: 1,
            loop: false,
            name: 'explosion',
            damageWeight: Settings.DefaultExplosionDamageWeight
            });

            explosion.id = 0;
            field.addChild(explosion);

            var sound = new Howl({
                urls: ['sounds/shotgun.mp3']
            });

            function explode(target){
                actions.explode(explosion, target, sound, Settings.JinnBulletExplosionDuration);
            } 

            return {
                explode: explode
            }

        }());


        return {
            mummy: mummy,
            jinn: jinn,
            blast: blast
        };

    }());

    return {
        creatures: creatures
    }

}(gameController.playField, actionController));