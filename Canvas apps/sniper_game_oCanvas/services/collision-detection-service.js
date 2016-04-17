var collisionDetectionService = (function(){

    function detectCollision(model, others){
        var collided = false;
        for (var i = 0; i < others.length; i++) {
            var enemy = others[i];
            if (Math.abs(enemy.x - model.x) <= 50 && Math.abs(enemy.y - model.y) <= 50){
                collided = true;
                break;
            }
        }

        return collided;
    }

    return {
        detectCollision: detectCollision
    }

}());