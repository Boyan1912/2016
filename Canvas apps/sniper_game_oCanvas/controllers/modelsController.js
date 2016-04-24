var modelsController = (function(field, models){

    function addEnemies(count, type, settings){
        count = count || 1;
        var enemies = [],
            originalModel = models.getOriginalEnemyModel(type);

        settings = settings || { y: originalModel.y };

        for(var i = 0; i < count; i++){
            settings.x = Math.random() * Settings.PlayFieldLength;
            var clone = models.cloneModel(settings, originalModel);
            enemies.push(clone);
        }

        return enemies;
    }

    function addEnemiesToGame(count, type, settings){
        var enemies = addEnemies(count, type, settings);
        for (var i = 0; i < enemies.length; i++) {
            field.addChild(enemies[i]);
        }

        return models.getModelsByName(type);
    }

    function updateModelHealth(model, damage){
        model.health -= damage;
        //logger.monitorHitDamage(model, damage);
        if(models.isDead(model) && model.name !== 'sniper'){
            handleDeadEnemyModel(model);
        }else if(models.isDead(model) && model.name === 'sniper'){
            console.log('DEAD!!!!');
        }
    }

    function handleDeadEnemyModel(model){
        //console.log('DEAD: ' + model.name);
        var player = models.getOriginalShooter();
        player.points += model.killValuePoints;
        //console.log('POINTS: ' + player.points);
        model.stop();

        model.remove();
    }

    return {
        addEnemiesToGame: addEnemiesToGame,
        updateModelHealth: updateModelHealth
    }

}(gameController.playField, modelsService));