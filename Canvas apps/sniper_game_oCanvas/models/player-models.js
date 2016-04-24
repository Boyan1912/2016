var playerModels = (function(field){

    var shooter = (function (){
        var sniper = field.display.sprite({
            x: 150,
            y: 150,
            origin: { x: "center", y: "center" },
            image: "img/sniper.png",
            generate: true,
            width: 53,
            height: 63,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'sniper',
            health: Settings.PlayerInitialHealth,
            points: 0
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
            duration: Settings.DefaultSpriteDuration,
            name: 'rocket',
            damageWeight: Settings.DefaultInitialRocketDamageWeight
        });

        rocket.id = 0;
        field.addChild(rocket);
        var gunShellsCount = Settings.PlayerInitialGunShellsCount;

        return {
            gun: rocket,
            shellsCount: gunShellsCount
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
            duration: Settings.DefaultSpriteDuration,
            frame: 1,
            loop: false,
            name: 'explosion'
        });

        explosion.id = 0;
        field.addChild(explosion);

        function explode(settings){
            var clone = explosion.clone({ x: settings.x, y: settings.y });
            field.addChild(clone);
            clone.startAnimation();
            setTimeout(function(){
                clone.remove();
            }, Settings.RocketExplosionDuration);
        }

        return {
            explosion: explosion,
            explode : explode
        }
    }());

    return {
        shooter: shooter,
        weapon: weapon,
        blast: blast
    }
}(gameController.playField));