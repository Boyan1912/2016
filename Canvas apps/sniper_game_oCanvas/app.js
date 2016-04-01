game.start();

var canvas = oCanvas.create({
    canvas: "#canvas",
    background: "#222"
});

$('#canvas').on('mousemove', function(e){
    var angle = positioningService.getAngle(sniper.x, sniper.y, e.clientX, e.clientY);
    sniper.startAnimation();
    sniper.rotateTo(angle - 90);
    sniper.stopAnimation();
});

$('#canvas').on('mousedown', function(e){
    if (e.which === 3){
        sniper.stop();
        canvas.setLoop(function(){
            sniper.startAnimation();
        }).start();

        sniper.animate({
            x: e.clientX < 900 ? e.clientX : 900, // keep it inside screen
            y: e.clientY
        }, {
            easing: 'linear',
            duration: Math.abs(e.clientX - sniper.x) > 500 || Math.abs(e.clientY - sniper.y) > 500 ? 3000 : 1500,
            callback: function(){
                canvas.setLoop(function(){
                    sniper.stopAnimation();
                }).start();
            }
        });
    }
});

$('#canvas').on('click', function(e){
    rocket.x = sniper.x;
    rocket.y = sniper.y;
    var angle = positioningService.getAngle(rocket.x, rocket.y, e.clientX, e.clientY);
    rocket.rotateTo(angle + 90);

    var newRocket = rocket.clone();
    canvas.addChild(newRocket);
    rocket.x = -1000; // hide from screen

    canvas.setLoop(function(){
        newRocket.startAnimation();
    }).start();

    newRocket.animate({
        x: e.clientX < 900 ? e.clientX : 900,
        y: e.clientY
    }, {
        easing: 'linear',
        duration: Math.abs(e.clientX - newRocket.x) > 500 || Math.abs(e.clientY - newRocket.y) > 500 ? 1000 :
            Math.abs(e.clientX - newRocket.x) < 100 || Math.abs(e.clientY - newRocket.y) < 100 ? 100 : 300,
        callback: function(){
            explosion.x = e.clientX < 900 ? e.clientX : 900;
            explosion.y = e.clientY;
            explosion.startAnimation();
            explosion.frame = 1;
            canvas.removeChild(newRocket);
        }
    });
});