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

        return models.getAllEnemyModels();
    }

    function monitorPlayerAdvance(){
        return setInterval(function(){
            var player = models.getOriginalShooter();
            if(player.points >= Settings.PointsNeededForNextStage){
                alertProgressMade();
            }

        }, Settings.MonitorPlayersAdvanceInterval);
    }

    function alertProgressMade(){

    }



    return {
        addEnemiesToGame: addEnemiesToGame,

    }

}(gameController.playField, modelsService));