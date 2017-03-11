var modelsController = (function(gameCntrl, bgCntrl, models, staticObjects){

    var field = gameCntrl.playField;
    
    function getEnemies(count, type, settings){
        if (models.getAllEnemyModels().length >= Settings.GamePerformance.Constraints.MaxPossibleNumberOfEnemies) return false;
        else if (type === 'jinn' && models.getAllJinns().length >= Settings.GamePerformance.Constraints.MaxNumberOfJinnsAllowed) return false;
        else if (type === 'jinn' && models.getAllJinns().length + count > Settings.GamePerformance.Constraints.MaxNumberOfJinnsAllowed) count = Settings.GamePerformance.Constraints.MaxNumberOfJinnsAllowed - models.getAllJinns().length;
        count = count || 0;
        var enemies = [],
            protoModel = models.getProtoModelByName(type);

        settings = settings || {};
        for(var i = 0; i < count; i++){
            var X = settings.x || Math.random() * Settings.General.PlayFieldWidth,
                Y = settings.y  || Math.random() * Settings.General.PlayFieldLength;

            var clone = models.cloneModel({x: X, y:Y}, protoModel);
            enemies.push(clone);
        }

        return enemies;
    }

    function addEnemiesToGame(count, type, settings){
        var enemies = getEnemies(count, type, settings);
        if (enemies){
            for (var i = 0; i < enemies.length; i++) {
                field.addChild(enemies[i]);
            }
        }

        return models.getModelsByName(type);
    }

    function updateModelHealth(model, damage){
        if(model.name === 'sniper'){
            if (model.armour == 'silver'){
                damage -= damage * Settings.StaticItems.SilverShieldProtection;
            }else if(model.armour == 'golden'){
                damage -= damage * Settings.StaticItems.GoldenShieldProtection;
            }
        }
        model.health -= damage;
        gameCntrl.displayModelInfo(model);
        if(models.isDead(model) && model.name !== 'sniper'){
            handleDeadEnemyModel(model);
        }else if(models.isDead(model) && model.name === 'sniper') {
            // handle Game Over
            gameCntrl.displayPlayerInfo(model);
        }
    }

    function updatePlayerAttributes(player, staticObjectType) {
        player = player || models.getShooterFromField();
        switch (staticObjectType.name){
            case 'health':
                player.health += Settings.StaticItems.FirstAidKitHealValue;
                soundsController.lazyLoadPlay('success1');
                break;
            case 'ammo':
                playerModels.weapon.gun.shellsCount += Settings.StaticItems.AmmoGunShellsValue;
                soundsController.lazyLoadPlay('ammoPick');
                break;
            case 'ammoBag':
                playerModels.weapon.gun.shellsCount += Settings.StaticItems.AmmoBagGunShellsValue;
                soundsController.lazyLoadPlay('ammoBagPick');
                break;
            case 'silverArmour':
                updatePlayersArmour('silver');
                break;
            case 'goldenArmour':
                updatePlayersArmour('golden');
                break;
            case 'ice':
                loopsController.freezeEnemies(Settings.StaticItems.IceFreezeTime);
        }
        gameCntrl.displayPlayerInfo(player);
    }

    function updatePlayersArmour(armour, protectionDuration) {
        protectionDuration = protectionDuration || Settings.StaticItems.ShieldProtectionDuration;
        var player = models.getShooterFromField();

        player.armour = armour;
        clearTimeout(player.timeoutProtection);
        player.timeoutProtection = setTimeout(function () {
            player.armour = 'none';
            gameCntrl.displayPlayerInfo(player);
        }, protectionDuration, this.name);
        soundsController.lazyLoadPlay('armourPick');
    }

    function stopEnemyModelsAnimation() {
        var enemies = models.getAllEnemyModels();
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            enemy.stop();
        }
    }

    function handleDeadEnemyModel(model){
        var player = models.getShooterFromField();
        player.points += model.killValuePoints;
        soundsController.playSoundOnDeath(model);
        // displayImageOnModelDeath(model, models.getProtoModelByName('grave'), Settings.General.GraveDisplayTimeDuration);
        displayStaticImageOnModelDeath(model, 'grave', Settings.General.GraveDisplayTimeDuration);
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

    function displayStaticImageOnModelDeath(model, image, displayTime) {
        var staticObj = staticObjects.addStaticObject(image, undefined, {x: model.x, y:model.y}, 80, 4);

        setTimeout(() =>{
            if (staticObj) staticObj.disappear();
        }, displayTime)
    }

    function addStaticObjectsToGame(count, type, size, coord) {
        staticObjects.addManyStaticObjectsByType(count, type, size, coord)
    }

    return {
        addEnemiesToGame: addEnemiesToGame,
        updateModelHealth: updateModelHealth,
        updatePlayerAttributes: updatePlayerAttributes,
        addStaticObjectsToGame: addStaticObjectsToGame,
        stopEnemyModelsAnimation: stopEnemyModelsAnimation
    }

}(gameController, bgController, modelsService, staticModels));
