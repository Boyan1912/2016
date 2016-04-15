var playController = (function(){

    function turnModelToPoint(model, X, Y){
        var angle = positioningService.getAngle(model.x, model.y, X, Y);
        logger.executeSpriteCommand(model, 'rotateToAdjusted', angle);
    }

    return {
        turnModelToPoint: turnModelToPoint
    }

}());