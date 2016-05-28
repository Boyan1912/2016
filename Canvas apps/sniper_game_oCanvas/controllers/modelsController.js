var modelsController = (function(field, models){

    function addEnemies(count, type, settings){
        count = count || 1;
        var enemies = [],
            protoModel = models.getProtoModelByName(type);

        settings = settings || { };

        for(var i = 0; i < count; i++){
            settings.x = settings.x || Math.random() * Settings.PlayFieldLength;
            settings.y = settings.y  || Math.random() * Settings.PlayFieldWidth;

            var clone = models.cloneModel(settings, protoModel);
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
        var player = models.getShooterFromField();
        player.points += model.killValuePoints;
        soundsController.playSoundOnDeath(model);
        displayImageOnModelDeath(model, models.getGraveImage(), Settings.GraveDisplayTimeDuration);
        model.remove();
    }

    function displayImageOnModelDeath(model, image, displayTime){
      image = image || models.getProtoModelByName('grave');
      model.stop();
      var clone = models.cloneModel({x: model.x, y: model.y}, image);
      field.addChild(clone);
      model.remove();
      setTimeout(() => {
        clone.fadeOut("long", "ease-in-out-cubic", () => {
            clone.remove();
        });
      }, displayTime);
    }

    return {
        addEnemiesToGame: addEnemiesToGame,
        updateModelHealth: updateModelHealth,
    }

}(gameController.playField, modelsService));
