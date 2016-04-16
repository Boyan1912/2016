var eventsController = (function(field){

    function onMouseMove(model){
        field.bind('mousemove', function(e){
            actionController.turnToPoint(model, e.x, e.y);
        })
    }

    function onRightButtonClick(model){
        // remove context menu from mouse's right click
        var canvas = document.getElementById('canvas');
        canvas.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        }, false);

        field.bind('mousedown', function(e){
            if (e.which === 2){
                actionController.moveToPoint(model, e.x, e.y);
            }
        });
    }

    function onClick(playerItems){
        field.bind('mousedown', function(e){
            if (e.which === 1){
                var target = {
                    x: e.x,
                    y: e.y
                };
                actionController.fireOnTarget(field, playerItems.shooter, playerItems.weapon, target, playerItems.blast);
            }
        });
    }

    function init(playerItems){
        onMouseMove(playerItems.shooter);
        onRightButtonClick(playerItems.shooter);
        onClick(playerItems);
    }

    return {
        init: init
    }

}(gameController.playField));