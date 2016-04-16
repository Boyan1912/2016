var enemyModels = (function(field){

    var entities = (function (){
        var mummy = field.display.sprite({
            x: -100,
            y: -100,
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

        function addMummies(count, settings){
            count = count || 1;
            settings = settings || { y: mummy.y };

            for(var i = 0; i < count; i++){
                settings.x = Math.random() * Constants.PlayFieldLength;
                var clone = mummy.clone(settings);
                field.addChild(clone);
            }
        }

        return {
            mummy: mummy,
            addMummies: addMummies
        };

    }());

    return {
        entities: entities
    }

}(gameController.playField));