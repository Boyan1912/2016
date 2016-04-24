var modelsService = (function(field, plModels, enModels, calculations){

    var Id = 0;

    function getAllCanvasElements(){
        return field.children;
    }

    function getModelsByName(name){
        return getAllCanvasElements().filter(function(model){
            return model.name === name && model.id !== 0;
        })
    }

    function getById(id){
        validator.validateId(id);
        return getAllCanvasElements().find(function(model){
            return model.id === id;
        })
    }

    function getByNameAndId(name, id){
        validator.validateId(id);
        return getModelsByName(name).find(function(model){
            return model.id === id;
        })
    }

    function getAllActiveExplosions(){
        return getAllCanvasElements().filter(function(model){
            return model.name === 'explosion' && model.id > 0 && model.active;
        })
    }

    function getAllEnemyModels(){
        return getAllCanvasElements().filter(function(model){
            return model.name !== 'sniper' && model.name !== 'rocket'
                && model.name !== 'explosion' && model.id > 0 && !!model.health;
        })
    }

    function getAllDamageableModels(){
        return getAllCanvasElements().filter(function(model){
            return !!model.health && model.id > 0;
        })
    }

    function getOriginalEnemyModel(name){
        return enModels.creatures[name];
    }

    function getOriginalPlayerItem(name){
        return plModels[name];
    }

    function getOriginalShooter(){
        return plModels.shooter;
    }

    function getAllMummies(){
        return getModelsByName('mummy');
    }

    function getShooterFromField(){
        return getAllCanvasElements().find(function(model){
            return model.name === 'sniper';
        })
    }

    function detectManyToOneCollision(model, others, tolerance){
        for (var i = 0; i < others.length; i++) {
            var obj = others[i];
            if (calculations.isHit(model, obj, tolerance)){
                return calculations.calculateDamage(model, obj, tolerance);
            }
        }

        return false;
    }

    function getHitObjects(model, others, tolerance){
        var hitObjects = [];
        for (var i = 0; i < others.length; i++) {
            var obj = others[i];

            if (calculations.isHit(model, obj, tolerance)){
                obj.violator = model;
                obj.damaged = calculations.calculateDamage(model, obj, tolerance);
                hitObjects.push(obj);
            }
        }

        return hitObjects;
    }

    function getRandomCoordinatesAroundPlace(place, marginX, marginY){
        marginY = marginY || marginX;
        var sign = Math.random() > 0.5;
        var x = sign ? (place.x + Math.random() * marginX) : (place.x - Math.random() * marginX);
        sign = Math.random() > 0.5;
        var y = sign ? (place.y + Math.random() * marginY) : (place.y - Math.random() * marginY);

        return {
            x: x,
            y: y
        };
    }

    function cloneModel(settings, model){
        var clone = model.clone(settings);
        clone.id = ++Id;
        return clone;
    }

    function isDead(model){
        return model.health <= 0;
    }

    function isViable(model){
        return model.health > Settings.MinViabilityHealthPoints;
    }

    function getUniqueId(){
        return ++Id;
    }

    return {
        getAllCanvasElements: getAllCanvasElements,
        getById: getById,
        getModelsByName: getModelsByName,
        getByNameAndId: getByNameAndId,
        getAllMummies: getAllMummies,
        getShooterFromField: getShooterFromField,
        getRandomCoordinatesAroundPlace: getRandomCoordinatesAroundPlace,
        cloneModel: cloneModel,
        getOriginalEnemyModel: getOriginalEnemyModel,
        getOriginalPlayerItem: getOriginalPlayerItem,
        getOriginalShooter: getOriginalShooter,
        detectManyToOneCollision: detectManyToOneCollision,
        getHitObjects: getHitObjects,
        isDead: isDead,
        isViable: isViable,
        getUniqueId: getUniqueId,
        getAllEnemyModels: getAllEnemyModels,
        getAllActiveExplosions: getAllActiveExplosions,
        getAllDamageableModels: getAllDamageableModels
    }


}(gameController.playField, playerModels, enemyModels, calculationsService));