var enemyModels = (function(field, actions){
    var creatures = (function (){
        var mummy = field.display.sprite({
            x: 10,
            y: -10,
            origin: { x: "center", y: "center" },
            image: "img/mummy.png",
            generate: true,
            width: 40,
            height: 58,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'mummy',
            health: Settings.DefaultInitialEnemyHealth,
            damageWeight: Settings.DefaultInitialMummyDamageWeight,
            killValuePoints: Settings.MummyKillValuePoints
        });

        mummy.id = 0;
        field.addChild(mummy);

        var longBurningSound = new Howl({
            urls: ['sounds/houseonfire.mp3'],
            loop: false,
            volume: 0.4
          });

        var burningSound = new Howl({
            urls: ['sounds/torch.mp3'],
            loop: false,
            volume: 0.5
          });

        var fireDemon = field.display.sprite({
            x: 10,
            y: -10,
            origin: { x: "center", y: "center" },
            image: "img/fire-demon.png",
            generate: true,
            width: 34,
            height: 34,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'fire_demon',
            currentFieldRunoverTime: Settings.InitialFireDemonTimeToCrossField,
            health: Settings.DefaultInitialEnemyHealth,
            damageWeight: Settings.InitialFireDemonDamageWeight,
            killValuePoints: Settings.FireDemonKillValuePoints,
            tempo: 1,
            run: function(initialSpeed, acceleration){
              initialSpeed = initialSpeed || this.currentFieldRunoverTime;
              this.duration = acceleration > 1 ? --this.duration : ++this.duration;
              this.tempo *= acceleration;
              this.currentFieldRunoverTime = initialSpeed - this.tempo;

              let y = Math.random() * Settings.PlayFieldLength;
              actions.moveToPoint(this, 0, y, this.currentFieldRunoverTime, undefined,
                 Settings.PlayFieldLength, Settings.PlayFieldWidth, function(){
                    this.x = Settings.PlayFieldWidth;
                    this.run();
               });
           }
        });

        fireDemon.id = 0;
        field.addChild(fireDemon);

        // TEST
        var fire = field.display.sprite({
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
              burningSound.play();
            },
            stopSound: function(){
              burningSound.stop();
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

        fire.id = 0;
        field.addChild(fire);

        var jinn = field.display.sprite({
            x: 50,
            y: -20,
            origin: { x: "center", y: "center" },
            image: "img/jinn.png",
            generate: true,
            width: 60,
            height: 56,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'jinn',
            health: Settings.DefaultInitialEnemyHealth,
            damageWeight: Settings.DefaultInitialJinnDamageWeight,
            killValuePoints: Settings.JinnKillValuePoints,
            shoot: function(target){
                actions.fireOnTarget(this, target, jinnBullet, blast, Settings.MaxTimeForJinnBulletToCrossField);
            }
        });

        jinn.id = 0;
        field.addChild(jinn);

        var fireBallSound = new Howl({
            urls: ['sounds/large-fireball.mp3']
        });
        var jinnBullet = field.display.sprite({
            x: 50,
            y: 20,
            origin: { x: "center", y: "center" },
            image: "img/jinnbullet.png",
            generate: true,
            width: 32,
            height: 24,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            name: 'jinnBullet',
            damageWeight: Settings.DefaultInitialJinnDamageWeight,
            playSound: function(){
                fireBallSound.play();
              }
            });

            jinnBullet.id = 0;
            field.addChild(jinnBullet);

        var blast = (function(){
            var explosion = field.display.sprite({
            x: -1000,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/explosion3.png",
            generate: true,
            width: 64,
            height: 62,
            direction: "x",
            duration: Settings.DefaultSpriteDuration,
            frame: 1,
            loop: false,
            name: 'explosion',
            damageWeight: Settings.DefaultExplosionDamageWeight,
            playSound: function(){
                burningSound.play();
              }
            });

            explosion.id = 0;
            field.addChild(explosion);

            function explode(target){
                actions.explode(explosion, target, Settings.JinnBulletExplosionDuration);
            }

            return {
                explode: explode
            }

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
            mummy: mummy,
            jinn: jinn,
            fireDemon: fireDemon,
            blast: blast,
            grave: grave,
            fire: fire
        };

    }());

    return {
        creatures: creatures
    }

}(gameController.playField, actionController));
