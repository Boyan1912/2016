var playerModels = (function(gameCntrl, actions, sounds){
    var field = gameCntrl.playField;
    var shooter = (function (){
        var sniper = field.display.sprite({
            x: Settings.General.PlayFieldWidth / 2,
            y: Settings.General.PlayFieldLength / 2,
            origin: { x: "center", y: "center" },
            image: "img/sniper.png",
            generate: true,
            width: 53,
            height: 63,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            name: 'sniper',
            health: Settings.Player.PlayerInitialHealth,
            points: 0,
            id: 0,
            armour: 'none',
            timeoutProtection: undefined,
            shoot: function(target){
                if(weapon.gun.shellsCount > 0){
                    actions.fireOnTarget(this, target, weapon.gun, blast, Settings.Player.MaxTimeForRocketToCrossField);
                    gameCntrl.displayPlayerInfo();
                }else {
                    weapon.gun.playEmptyGunSound();
                }
            }
        });
        
        field.addChild(sniper);
        return sniper;
    }());

    var weapon = (function (){
        
        var rocket = field.display.sprite({
            x: -1000,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/rocket.png",
            generate: true,
            width: 26,
            height: 49,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            name: 'rocket',
            damageWeight: Settings.Player.DefaultExplosionDamageWeight,
            shellsCount: Settings.Player.PlayerInitialGunShellsCount,
            playSound: function(){
                sounds.lazyLoadPlay('shotgunSound');
            },
            playEmptyGunSound: function(){
                sounds.lazyLoadPlay('emptyGunSound');
            }
        });

        rocket.id = 0;
        field.addChild(rocket);

        return {
            gun: rocket
        }
    }());

    var blast = (function (){
        
        var explosion = field.display.sprite({
            x: -1000,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/explosion.png",
            generate: true,
            width: 128,
            height: 128,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            frame: 1,
            loop: false,
            name: 'explosion',
            isPlayerOwned: true,
            damageWeight: Settings.Player.DefaultExplosionDamageWeight,
            playSound: function(){
              sounds.lazyLoadPlay('explosionSound');
            }
        });

        explosion.id = 0;
        field.addChild(explosion);

        function explode(target){
            actions.explode(explosion, target, Settings.Player.RocketExplosionDuration);
        }

        return {
            explode : explode,
            damageWeight: explosion.damageWeight
        }
    }());

    return {
        shooter: shooter,
        weapon: weapon,
        blast: blast
    }
}(gameController, actionController, soundsController));
