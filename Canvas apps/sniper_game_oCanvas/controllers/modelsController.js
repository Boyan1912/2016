var modelsController = (function(gameCntrl, models){

    var field = gameCntrl.playField;
    
    function addEnemies(count, type, settings){
        count = count || 1;
        var enemies = [],
            protoModel = models.getProtoModelByName(type);

        settings = settings || {};
        for(var i = 0; i < count; i++){
            var X = settings.x || Math.random() * Settings.PlayFieldWidth,
                Y = settings.y  || Math.random() * Settings.PlayFieldLength;

            var clone = models.cloneModel({x: X, y:Y}, protoModel);
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
        if(model.name !== 'sniper'){
            gameCntrl.displayModelInfo(model);
        }
        if(models.isDead(model) && model.name !== 'sniper'){
            handleDeadEnemyModel(model);
        }else if(model.name === 'sniper') {
            gameCntrl.displayPlayerInfo(model);
        }
        
    }
    
    function handleDeadEnemyModel(model){
        var player = models.getShooterFromField();
        player.points += model.killValuePoints;
        soundsController.playSoundOnDeath(model);
        displayImageOnModelDeath(model, models.getProtoModelByName('grave'), Settings.GraveDisplayTimeDuration);
        model.remove();
        gameCntrl.displayPlayerInfo(models.getShooterFromField());
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
        updateModelHealth: updateModelHealth
    }

}(gameController, modelsService));
