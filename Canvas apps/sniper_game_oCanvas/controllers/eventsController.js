var eventsController = (function(field, actionCntrl, models){

    function onMouseMove(){
        field.bind('mousemove', function(e){
            var player = models.getOriginalShooter();
            actionCntrl.turnToPoint(player, e.x, e.y);
        })
    }

    function onRightButtonClick(){
        var canvas = document.getElementById('canvas'),
            player = models.getOriginalShooter(),
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

                actionCntrl.moveToPoint(player, e.x, e.y);
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
                    player = models.getOriginalShooter();

                actionCntrl.fireOnTarget(player, target);
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

}(gameController.playField, actionController, modelsService));