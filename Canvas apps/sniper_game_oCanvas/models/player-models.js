var playerModels = (function(field, actions){

    var shooter = (function (){
        var sniper = field.display.sprite({
            x: Settings.PlayFieldWidth / 2,
            y: Settings.PlayFieldLength / 2,
            origin: { x: "center", y: "center" },
            image: "img/sniper.png",
            generate: true,
            width: 53,
            height: 63,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'sniper',
            health: Settings.PlayerInitialHealth,
            points: 0,
            id: 0,
            shoot: function(target){
                actions.fireOnTarget(this, target, weapon.gun, blast, Settings.MaxTimeForRocketToCrossField);
            }
        });

        field.addChild(sniper);
        return sniper;
    }());

    var weapon = (function (){
        var shotgunSound = new Howl({
            urls: ['sounds/shotgun.mp3']
        });
        var emptyGunSound = new Howl({
            urls: ['sounds/empty_gun.mp3']
        });
        var rocket = field.display.sprite({
            x: -1000,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/rocket.png",
            generate: true,
            width: 26,
            height: 49,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'rocket',
            damageWeight: Settings.DefaultInitialRocketDamageWeight,
            shellsCount: Settings.PlayerInitialGunShellsCount,
            playSound: function(){
              shotgunSound.play();
            },
            playEmptyGunSound: function(){
              emptyGunSound.play();
            }
        });

        rocket.id = 0;
        field.addChild(rocket);

        return {
            gun: rocket
        }
    }());

    var blast = (function (){
        var explosionSound = new Howl({
            urls: ['sounds/explosion.mp3']
        });
        var explosion = field.display.sprite({
            x: -1000,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/explosion.png",
            generate: true,
            width: 128,
            height: 128,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            frame: 1,
            loop: false,
            name: 'explosion',
            isPlayerOwned: true,
            damageWeight: Settings.DefaultExplosionDamageWeight,
            playSound: function(){
              explosionSound.play();
            }
        });

        explosion.id = 0;
        field.addChild(explosion);

        function explode(target){
            actions.explode(explosion, target, Settings.RocketExplosionDuration);
        }

        return {
            explode : explode
        }
    }());

    return {
        shooter: shooter,
        weapon: weapon,
        blast: blast
    }
}(gameController.playField, actionController));
