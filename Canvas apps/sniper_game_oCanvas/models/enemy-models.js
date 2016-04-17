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
            duration: Constants.DefaultSpriteDuration,
            name: 'mummy'
        });

        field.addChild(mummy);

        return {
            mummy: mummy
        };

    }());

    return {
        creatures: creatures
    }

}(gameController.playField));