(function(){
    var ctx = CONSTANTS.Canvas;

    game.start().then(function(data){
        animations.loop(sniper.visualizeRotation);
    }, function(err){
        console.log(err);
    });

    $(ctx).on('mousedown', function(event){
        console.log('event triggered');
        if (event.which === 3){
            move.go(sniper, event)
        }
    })
}());

