var game = (function(){

    function start(){
        showStartScreen();
        return new Promise(function(resolve, reject){
            $('#startButton').on('click', function(event){
                animations.animateStart(this.parentNode);
                resolve(event);
            });
        })
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