var sniper = (function(){
    var model = images.sprites['sniper'];

    var x = model.coordinates.x,
        y = model.coordinates.y;

    model.visualizeRotation = function() {
        drawRotated();
    };

    function drawRotated(degrees){
        var canvas = CONSTANTS.Canvas;
        model.context.save();
        model.context.clearRect(0, 0, canvas.width, canvas.height);
        degrees = degrees || updateRotationAngle();
        model.context.translate(x, y);
        model.rotate(degrees / 4);
        model.render();
        model.context.restore();
    }

    model.rotate = function (angle){
        model.context.rotate(angle);
    };

    function updateRotationAngle(){
        //return positioningService.calculateAngle(spriteObj.coordinates);
        return positioningService.calculateAngleInRelation(model.coordinates);
    }

    return model;

}());