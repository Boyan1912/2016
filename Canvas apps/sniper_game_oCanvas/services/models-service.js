var modelsService = (function(field, calculations, validator, statics){

    var Id = 0;

    function getAllCanvasElements(){
        return field.children;
    }

    function getAllElementsInPlay() {
        return getAllCanvasElements().filter(function (model) {
            return model.id > 0;
        })
    }

    function getModelsByName(name){
        return getAllCanvasElements().filter(function(model){
            return model.name === name && model.id > 0;
        })
    }

    function getLatestModelOfType(name){
        let sorted =  getModelsByName(name).sort(function(a, b){
            return a.id - b.id;
        });

        return sorted.pop();
    }

    function getById(id){
        validator.validateId(id);
        return getAllCanvasElements().find(function(model){
            return model.id === id;
        })
    }

    function getProtoModelByName(name){
        validator.validateString(name);
        return getAllCanvasElements().find(function(model){
            return model.name === name && model.id === 0;
        });
    }

    function getByNameAndId(name, id){
        validator.validateId(id);
        return getModelsByName(name).find(function(model){
            return model.id === id;
        })
    }

    function getVariousTypesByName(names){
        var result = [];
        for (var i = 0; i < names.length; i++) {
            var models = getModelsByName(names[i]);
            result = result.concat(models);
        }
        return result;
    }

    function getAllActiveExplosions(){
        return getAllCanvasElements().filter(function(model){
            return (model.name === 'explosion' && model.id > 0) ||
                   (model.name === 'fire' && model.id > 0);
        })
    }

    function getPlayerActiveExplosions(){
        return getAllCanvasElements().filter(function(model){
            return (model.name === 'explosion' && model.isPlayerOwned && model.id > 0) ||
            (model.name === 'rocket' && model.id > 0);
        })
    }

    function getAllActiveAndPotentialExplosions(){
      return getAllCanvasElements().filter(function(model){
          return (model.name === 'explosion' && model.id > 0) ||
          (model.name === 'rocket' && model.id > 0) ||
          (model.name === 'fireball' && model.id > 0)
      })
    }

    function getAllFireBalls() {
        return getAllCanvasElements().filter(function(model){
            return (model.name === 'fireball' && model.id > 0);
        })
    }

    function getAllEnemyModels(){
        return getAllCanvasElements().filter(function(model){
            return model.name !== 'sniper' && model.name !== 'rocket'
            && model.id > 0 && !!model.health;
        })
    }

    function getAllDamageableModels(){
        return getAllCanvasElements().filter(function(model){
            return !!model.health && model.id > 0;
        })
    }

    function getAllFires(){
        return getModelsByName('fire');
    }

    function getAllFireDemons(){
        return getModelsByName('fire_demon');
    }

    function getAllMummies(){
        return getModelsByName('mummy');
    }

    function getAllJinns(){
        return getModelsByName('jinn');
    }

    function getShooterFromField(){
        return getAllCanvasElements().find(function(model){
            return model.name === 'sniper';
        })
    }

    function getAllGraves(){
        return getModelsByName('grave');
    }

    function getRandomCoordinatesAroundPlace(place, marginX, marginY){
        marginY = marginY || marginX;
        var sign = Math.random() > 0.5;
        var x = sign ? ((place.x + Math.random() * marginX)) : (place.x - Math.random() * marginX);
        sign = Math.random() > 0.5;
        var y = sign ? (place.y + Math.random() * marginY) : (place.y - Math.random() * marginY);

        return {
            x: x < Settings.General.MinModelCoordinateValue ? Settings.General.MinModelCoordinateValue : x % Settings.General.PlayFieldWidth, // keep it inside the field
            y: y < Settings.General.MinModelCoordinateValue ? Settings.General.MinModelCoordinateValue : y % Settings.General.PlayFieldLength
        };
    }

    function cloneModel(settings, model){
        var clone = model.clone(settings);
        clone.id = getUniqueId();
        return clone;
    }

    function isDead(model){
        return model.health <= 0;
    }

    function getUniqueId(){
        return ++Id;
    }

    function getAllDead() {
        return getAllCanvasElements().filter(function(model){
            return (model.health <= 0 && model.name !== 'sniper') ||
                model.used;
        })
    }

    function megaDeathCaused() {
        return getAllGraves().length >= Settings.Gameplay.MinDeathsNeededForMegadeath;
    }

    function getAllStaticItems() {
        return statics.getAllStaticItems()
    }

    
    return {
        getAllCanvasElements: getAllCanvasElements,
        getById: getById,
        getModelsByName: getModelsByName,
        getByNameAndId: getByNameAndId,
        getAllMummies: getAllMummies,
        getAllJinns: getAllJinns,
        getAllFireDemons: getAllFireDemons,
        getAllFires: getAllFires,
        getLatestModelOfType: getLatestModelOfType,
        getShooterFromField: getShooterFromField,
        getRandomCoordinatesAroundPlace: getRandomCoordinatesAroundPlace,
        cloneModel: cloneModel,
        getProtoModelByName: getProtoModelByName,
        isDead: isDead,
        getUniqueId: getUniqueId,
        getAllEnemyModels: getAllEnemyModels,
        getAllActiveExplosions: getAllActiveExplosions,
        getPlayerActiveExplosions: getPlayerActiveExplosions,
        getAllDamageableModels: getAllDamageableModels,
        getVariousTypesByName: getVariousTypesByName,
        getAllGraves: getAllGraves,
        getAllActiveAndPotentialExplosions: getAllActiveAndPotentialExplosions,
        megaDeathCaused: megaDeathCaused,
        getAllDead: getAllDead,
        getAllElementsInPlay: getAllElementsInPlay,
        getAllFireBalls: getAllFireBalls,
        getAllStaticItems: getAllStaticItems
    }


}(gameController.playField, calculationsService, validator, staticModels));
