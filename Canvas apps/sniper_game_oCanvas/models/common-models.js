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

                torchSound: (function(){
                  return new Howl({
                      urls: ['sounds/torch.mp3'],
                      loop: false,
                      volume: 0.7
                    });
                }()),

                fireBallSound: (function(){
                    return new Howl({
                        urls: ['sounds/large-fireball.mp3']
                      });
                }()),

                burningOne: (function(){
                    return new Howl({
                        urls: ['sounds/burning.mp3']
                      });
                }()),

                forestFire: (function(){
                    return new Howl({
                        urls: ['sounds/forest_fire.mp3'],
                        volume: 1
                      });
                }()),

                explosion5: (function(){
                    return new Howl({
                        urls: ['sounds/Explosion+5.mp3'],
                      });
                }()),

                electricshock: (function(){
                    return new Howl({
                        urls: ['sounds/electricshock.mp3'],
                        volume: 0.3
                      });
                }()),

                male_scream1: (function(){
                    return new Howl({
                        urls: ['sounds/scream_male1.mp3'],
                        volume: Settings.DefaultPlayerAudioVolume
                      });
                }()),

                male_scream2: (function(){
                    return new Howl({
                        urls: ['sounds/scream_male2.mp3'],
                        volume: Settings.DefaultPlayerAudioVolume
                      });
                }()),

                male_scream3: (function(){
                    return new Howl({
                        urls: ['sounds/scream_male3.mp3'],
                        volume: Settings.DefaultPlayerAudioVolume
                      });
                }()),

                applause: (function(){
                    return new Howl({
                        urls: ['sounds/applause.mp3'],
                        // volume: Settings.DefaultPlayerAudioVolume
                      });
                }()),

                dying_scream: (function(){
                    return new Howl({
                        urls: ['sounds/death-scream.mp3'],
                        // volume: Settings.DefaultPlayerAudioVolume
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
              sounds.burningOne.play();
            },
            stopSound: function(){
              sounds.burningOne.stop();
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
          graveImage.id = 0;
          field.addChild(graveImage);
      }());


      return {
        sounds: sounds,
        grave: grave,
        fire: fire
      }

}(gameController.playField));
