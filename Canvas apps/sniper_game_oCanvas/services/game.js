var game = (function(){

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

    return {
        start: start
    }

}());