var gameController = (function(){

    function start(){
        showMessageScreen();
        $('#startButton').on('click', function(event){
            $(this.parentNode).addClass('animated bounceOutUp')
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).remove();
                    gameEngine.startGame();
                })
        });
    }

    function showMessageScreen(){
        var $startScreen = $('<div></div>', {id: 'startScreen'}),
            $startButton = $('<div></div>', {id: 'startButton'}),
            $startText = $('<span></span>', {id: 'startText'});

        $startText.text("Start Game");
        $startButton.append($startText);
        $startScreen.append($startButton);
        $('#wrapper').append($startScreen);
    }

    function playMusic(){
      sound = new Howl({
        urls: ['sounds/Epic Metalstep Mix.mp3'],
        autoplay: false,
        loop: true,
        volume: 1,
        // onend: function() {
        //   console.log('Finished!');
        // }
      });
    }

    var playField = (function(){
        return oCanvas.create({
            canvas: "#main-canvas",
            background: "transparent"
            // background: 'image(img/bg/wolf.jpg)'
            });
        }());

    var playerInfoObj = playField.display.text({
        x: 950,
        y: 15,
        origin: { x: "center", y: "top" },
        font: "bold 32px arial-black",
        text: "Welcome! Let's kick some ass!",
        fill: "#2288aa"
    });

    var modelInfoObj = playerInfoObj.clone({x: playerInfoObj.x + 300, text: ""});
    playField.addChild(playerInfoObj);
    playField.addChild(modelInfoObj);

    function displayPlayerInfo(player) {
        player = player || playerModels.shooter;
        if (player.name === 'sniper'){
            var healthText = player.health > 0 ? Math.floor(player.health) : "You're so fuckin' dead!";
            playerInfoObj.text = "Health:  " + healthText + "\nPoints:  " + player.points + "\n" +
                           "Bullets left:  " + playerModels.weapon.gun.shellsCount + "\n" +
                            // "Weapon type:  " + playerModels.weapon.gun.name.toUpperCase() + "\n" +
                            "Shell damage:  " + playerModels.blast.damageWeight  + "\n" +
                            "Armour:  " + player.armour;

            // playerInfoObj.family = "Rockwell, 'Courier Bold', Courier, Georgia, Times, 'Times New Roman', serif;";
            // playerInfoObj.fill = "#800000";
            // playerInfoObj.font = "bold 26px normal";
            // playerInfoObj.lineHeight = "29px";

            playerInfoObj.stroke = "outside 4px rgba(0, 0, 0, 0.7)";
            playerInfoObj.font = "bold 16px normal";
            playerInfoObj.family = "Rockwell, 'Courier Bold', Courier, Georgia, Times, 'Times New Roman', serif;";
        }

        playField.draw.redraw();
    }

    function displayModelInfo(model) {
        if(model.name === 'sniper'){
            displayPlayerInfo(model);
            return;
        }
        modelInfoObj.text = "Health: " + Math.floor(model.health) + "\n" +
                            "Enemy type:  " + model.name.toUpperCase() + "\n" +
                            "Damage:  " + model.damageWeight + "\n" +
                            "Kill points:  " + model.killValuePoints;


        modelInfoObj.fill = "#800000";
        modelInfoObj.stroke = "outside 4px rgba(0, 0, 0, 0.7)";
        modelInfoObj.font = "bold 16px normal";
        playerInfoObj.family = "Rockwell, 'Courier Bold', Courier, Georgia, Times, 'Times New Roman', serif;";
        playField.draw.redraw();
    }



    return {
        start: start,
        playField: playField,
        playMusic: playMusic,
        displayPlayerInfo: displayPlayerInfo,
        displayModelInfo: displayModelInfo,

    }
}());
