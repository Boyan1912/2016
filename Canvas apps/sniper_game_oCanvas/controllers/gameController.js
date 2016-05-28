var gameController = (function(){

    function start(){
        showStartScreen();
        $('#startButton').on('click', function(event){
            $(this.parentNode).addClass('animated bounceOutUp')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).remove();
                })
        });
    }

    function showStartScreen(){
        var $startScreen = $('<div></div>', {id: 'startScreen'}),
            $startButton = $('<div></div>', {id: 'startButton'}),
            $startText = $('<span></span>', {id: 'startText'});

        $startText.text("Start Game");
        $startButton.append($startText);
        $startScreen.append($startButton);
        $('#wrapper').append($startScreen);
    }

    function playMusic(){
      var sound = new Howl({
        urls: ['sounds/EPIC Game of Thrones (Extended Theme) Audio - PiscesRising.mp3'],
        autoplay: true,
        loop: true,
        volume: 0.3,
        // onend: function() {
        //   console.log('Finished!');
        // }
      });
    }

    var playField = (function(){
        return oCanvas.create({
            canvas: "#canvas",
            // background: 'image(img/bg/wolf.jpg)'
            background: '#000'
            });
        }());

    return {
        start: start,
        playField: playField,
        playMusic: playMusic
    }
}());
