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
            duration: Constants.DefaultSpriteDuration,
            name: 'sniper'
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
            duration: Constants.DefaultSpriteDuration,
            name: 'rocket'
        });

        field.addChild(rocket);
        return rocket;
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
            duration: Constants.DefaultSpriteDuration,
            frame: 1,
            loop: false,
            name: 'explosion'
        });

        field.addChild(explosion);

        function explode(settings){
            var clone = explosion.clone({ x: settings.x, y: settings.y });
            field.addChild(clone);
            clone.startAnimation();
            setTimeout(function(){
                clone.remove();
            }, Constants.RocketExplosionDuration);
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