var commonModels = (function(field){

      var sounds = (function(){
        return {
                longBurningSound: (function(){
                return new Howl({
                      urls: ['sounds/houseonfire.mp3'],
                      loop: false,
                      volume: 0.4
                    });
                }()),

                burningSound: (function(){
                  return new Howl({
                      urls: ['sounds/torch.mp3'],
                      loop: false,
                      volume: 0.5
                    });
                }()),

                fireBallSound: (function(){
                    return new Howl({
                        urls: ['sounds/large-fireball.mp3']
                      });
                }())
          };
      }());

      var fire = (function(){
        var fireModel = field.display.sprite({
            x: -10,
            y: 10,
            origin: { x: "center", y: "center" },
            image: "img/fire.png",
            generate: true,
            width: 38,
            height: 35,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'fire',
            playSound: function(){
              sounds.burningSound.play();
            },
            stopSound: function(){
              sounds.burningSound.stop();
            },
            damageWeight: Settings.InitialFireDamageWeight,
            burn: function(time){
              this.stop();
              this.startAnimation();
              this.playSound();
                  setTimeout(() => {
                    this.fadeOut("long", "ease-in-out-cubic");
                    this.stopSound();
                    this.remove();
                  }, time)
            }
         });
         fireModel.id = 0;
         field.addChild(fireModel);
         return fireModel;
      }());

      var grave = (function(){
        var graveImage = field.display.image({
           x: -1000,
           y: 0,
        	 origin: { x: "center", y: "center" },
        	 image: "img/grave.gif",
           name: "grave"
         });
          field.addChild(graveImage);

      }());


      return {
        sounds: sounds,
        grave: grave,
        fire: fire
      }

}(gameController.playField));
