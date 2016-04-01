var move = (function(){
    var model = {};

    model.go = function(sprite, event){
        model.destination = {
            x: event.clientX,
            y: event.clientY
        };

        model.routeData = positioningService.getRouteData(sprite.coordinates, model.destination);
        sprite.goTo(model.destination);
    };

    model.validator = {
        destinationReached: function(x, y){
            return x === model.destination.x && y === model.destination.y;
        },
        noRouteData: function(){
          return model.routeData.length < 1;
        },
        moveLongerDiagonal: function(step, longer){
            return step - Math.abs(longer) !== 0;
        },
        moveShorterDiagonal: function(step, ratio){
            return step % parseInt(ratio) === 0;
        }
    };

    return model;
}());



