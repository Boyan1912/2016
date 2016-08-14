var modelsController = (function(gameCntrl, models, staticObjects){

    var field = gameCntrl.playField;
    
    function getEnemies(count, type, settings){
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
        var enemies = getEnemies(count, type, settings);
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

    function updateModelState(model){
        if(models.isDead(model) && model.name !== 'sniper'){
            handleDeadEnemyModel(model);
        }else if(model.name === 'sniper') {
            gameCntrl.displayPlayerInfo(model);
        }
    }

    function updatePlayerAttributes(player, staticObjectType) {
        player = player || models.getShooterFromField();
        switch (staticObjectType.name){
            case 'health':
                player.health += Settings.FirstAidKitHealValue;
                soundsController.lazyLoadPlay('success1');
                gameCntrl.displayPlayerInfo(player);
                break;
            case 'ammo':
                playerModels.weapon.gun.shellsCount += Settings.AmmoGunShellsValue;
                soundsController.lazyLoadPlay('ammoPick');
                gameCntrl.displayPlayerInfo(player);
            case 'ammoBag':
                playerModels.weapon.gun.shellsCount += Settings.AmmoBagGunShellsValue;
                soundsController.lazyLoadPlay('ammoBagPick');
                gameCntrl.displayPlayerInfo(player);
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

    function addStaticObjectsToGame(count, type, size, coord) {
        staticObjects.addManyStaticObjectsByType(count, type, size, coord)
    }

    return {
        addEnemiesToGame: addEnemiesToGame,
        updateModelHealth: updateModelHealth,
        updatePlayerAttributes: updatePlayerAttributes,
        addStaticObjectsToGame: addStaticObjectsToGame
    }

}(gameController, modelsService, staticModels));
