var commonModels = (function(field){

      var sounds = (function(){
        return {
            longBurningSound: new Howl({
                urls: ['sounds/houseonfire.mp3'],
                loop: false,
                volume: 0.4
            }),

            torchSound: new Howl({
                urls: ['sounds/torch.mp3'],
                loop: false,
                volume: 0.7
            }),

            fireBallSound: new Howl({
                urls: ['sounds/large-fireball.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),

            burningOne: new Howl({
                urls: ['sounds/burning.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),

            forestFire: new Howl({
                urls: ['sounds/forest_fire.mp3'],
                volume: 1
            }),

            explosion5: new Howl({
                urls: ['sounds/Explosion+5.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),

            electricshock: new Howl({
                urls: ['sounds/electricshock.mp3'],
                volume: 0.3
            }),

            male_scream1: new Howl({
                urls: ['sounds/scream_male1.mp3'],
                volume: Settings.General.DefaultPlayerAudioVolume
            }),

            male_scream2: new Howl({
                urls: ['sounds/scream_male2.mp3'],
                volume: Settings.General.DefaultPlayerAudioVolume
            }),

            male_scream3: new Howl({
                urls: ['sounds/scream_male3.mp3'],
                volume: Settings.General.DefaultPlayerAudioVolume
            }),

            kick_your_ass_bitch: new Howl({
                urls: ['sounds/Im gonna kick your ass bitch.mp3'],
                // volume: Settings.General.DefaultPlayerAudioVolume
            }),

            fuckYouMotherFucker: new Howl({
                urls: ['sounds/FuckYouMotherFucker.mp3'],
            }),

            oh_Shit: new Howl({
                urls: ['sounds/oh_Shit.mp3'],
            }),

            dying_scream: new Howl({
                urls: ['sounds/death-scream.mp3'],
                volume: Settings.General.DefaultPlayerAudioVolume
            }),

            shotgunSound: new Howl({
                urls: ['sounds/shotgun.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),
            emptyGunSound: new Howl({
                urls: ['sounds/empty_gun.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),
            explosionSound: new Howl({
                urls: ['sounds/explosion.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),
            ammoPick: new Howl({
                urls: ['sounds/ammo.wav'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),
            ammoBagPick: new Howl({
                urls: ['sounds/ammo_pickup.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),
            success1: new Howl({
                urls: ['sounds/success1.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            }),
            armourPick: new Howl({
                urls: ['sounds/collect_armour.mp3'],
                volume: Settings.General.DefaultGameSoundsAudioVolume
            })
          };
      }());


      var fire = (function(){
        var fireModel = field.display.sprite({
            x: -100,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/fire.png",
            generate: true,
            width: 38,
            height: 35,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            name: 'fire',
            playSound: function(){
              soundsController.lazyLoadPlay('burningOne');
            },
            damageWeight: Settings.Enemies.Damage.InitialFireDamageWeight,
            burn: function(time){
              this.stop();
              this.startAnimation();
              this.playSound();
                  setTimeout(() => {
                    this.fadeOut("long", "ease-in-out-cubic");
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
           x: -100,
           y: 0,
        	 origin: { x: "center", y: "center" },
        	 image: "img/grave.gif",
           name: "grave"
         });
          graveImage.id = 0;
          field.addChild(graveImage);
      }());

      return {
        sounds: sounds
      }

}(gameController.playField));
