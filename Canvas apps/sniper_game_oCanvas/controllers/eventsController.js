var eventsController = (function(field, models){

    function onMouseMove(){
        field.bind('mousemove', function(e){
            var player = models.getShooterFromField();
            actionController.turnToPoint(player, e.x, e.y);
        })
    }

    function onRightButtonClick(){
        var canvas = document.getElementById('main-canvas'),
            player = models.getShooterFromField(),
            tolerance = Settings.ClickOnPlayerBugFixValue;
        // remove context menu from mouse's right click
        canvas.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        }, false);

        field.bind('mousedown', function(e){
            if (e.which === 2){
                // clicking on the player gives a bug
                if(Math.abs(e.x - player.x) <= tolerance && Math.abs(e.y - player.y) <= tolerance){
                    e.x += tolerance;
                    e.y += tolerance;
                }

                actionController.moveToPoint(player, e.x, e.y, Settings.MaxTimeForPlayerToCrossField);
            }
        });
    }

    function onClick(){
        field.bind('mousedown', function(e){
            if (e.which === 1){
                var target = {
                    x: e.x,
                    y: e.y
                    },
                    player = models.getShooterFromField();

                player.shoot(target);
            }
        });
    }

    function init(){
        onMouseMove();
        onRightButtonClick();
        onClick();
    }

    return {
        init: init
    }

}(gameController.playField, modelsService));
