var primaryModels = (function(){

    function createSniper(playField){
        var sniper = playField.display.sprite({
            x: 150,
            y: 150,
            origin: { x: "center", y: "center" },
            image: "img/sniper.png",
            generate: true,
            width: 53,
            height: 63,
            direction: "x",
            duration: 60,
            name: 'sniper',
            rotateToAdjusted: function(angle){
                this.startAnimation();
                this.rotateTo(angle + 90);
                this.stopAnimation();
            }
        });

        playField.addChild(sniper);
        return sniper;
    }

    function createRocket(playField, sniper){
        var rocket = playField.display.sprite({
            x: -1000,
            y: sniper.y,
            origin: { x: "center", y: "center" },
            image: "img/rocket.png",
            generate: true,
            width: 26,
            height: 49,
            direction: "x",
            duration: 60,
            name: 'rocket'
        });

        playField.addChild(rocket);
        return rocket;
    }

    function createExplosion(playField){
        var explosion = playField.display.sprite({
            x: -1000,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/explosion.png",
            generate: true,
            width: 128,
            height: 128,
            direction: "x",
            duration: 60,
            frame: 1,
            loop: false,
            name: 'explosion'
        });

        playField.addChild(explosion);
        return explosion;
    }

    return {
        createSniper: createSniper,
        createRocket: createRocket,
        createExplosion: createExplosion
    }

}());