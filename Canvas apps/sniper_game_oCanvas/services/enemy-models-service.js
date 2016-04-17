var enemyModelsService = (function(models){

    function addMummies(count, settings){
        count = count || 1;
        settings = settings || { y: models.creatures.mummy.y };
        var mummies = [];

        for(var i = 0; i < count; i++){
            settings.x = Math.random() * Constants.PlayFieldLength;
            var clone = models.creatures.mummy.clone(settings);
            mummies.push(clone);
        }

        return mummies;
    }


    return {
        addMummies: addMummies
    }


}(enemyModels));