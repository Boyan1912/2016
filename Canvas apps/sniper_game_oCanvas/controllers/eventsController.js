var eventsController = (function(){

    function onMouseMove(playField){
        playField.bind('mousemove', function(e){
            playController.turnModelToPoint(sniper, e.clientX, e.clientY);
        })
    }

    function onRightButtonClick(playField){
        playField.bind('mousedown', function(e){
            if (e.which === 2){
                sniper.stop();
                playField.setLoop(function(){
                    sniper.startAnimation();
                }).start();

                sniper.animate({
                    x: e.clientX < 900 ? e.clientX : 900, // keep it inside screen
                    y: e.clientY
                }, {
                    easing: 'linear',
                    duration: Math.abs(e.clientX - sniper.x) > 500 || Math.abs(e.clientY - sniper.y) > 500 ? 3000 : 1500,
                    callback: function(){
                        playField.setLoop(function(){
                            sniper.stopAnimation();
                        }).start();
                    }
                });
            }
        });
    }

    function onClick(playField){
        playField.bind('mousedown', function(e){
            if (e.which === 1){
                rocket.x = sniper.x;
                rocket.y = sniper.y;
                var angle = positioningService.getAngle(rocket.x, rocket.y, e.clientX, e.clientY);
                rocket.rotateTo(angle + 90);

                var newRocket = rocket.clone();
                playField.addChild(newRocket);
                rocket.x = -1000; // hide from screen

                playField.setLoop(function(){
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
                        playField.removeChild(newRocket);
                    }
                });
            }
        });
    }

    function init(playField){
        onMouseMove(playField);
        onRightButtonClick(playField);
        onClick(playField);
    }

    return {
        init: init
    }

}());