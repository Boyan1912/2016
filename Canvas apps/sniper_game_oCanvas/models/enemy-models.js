var enemyModels = (function(field, actions, sounds){
    var creatures = (function (){
        var mummy = field.display.sprite({
            x: 0,
            y: -100,
            origin: { x: "center", y: "center" },
            image: "img/mummy.png",
            generate: true,
            width: 40,
            height: 58,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            name: 'mummy',
            health: Settings.Enemies.DefaultInitialEnemyHealth,
            damageWeight: Settings.Enemies.Damage.InitialMummyDamageWeight,
            killValuePoints: Settings.Enemies.KillValues.MummyKillValuePoints
        });

        mummy.id = 0;
        field.addChild(mummy);

        var fireDemon = field.display.sprite({
            x: 0,
            y: -100,
            origin: { x: "center", y: "center" },
            image: "img/fire-demon.png",
            generate: true,
            width: 34,
            height: 34,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            name: 'fire_demon',
            currentFieldRunoverTime: Settings.Enemies.SpeedOptions.FireDemonTimeToCrossField,
            health: Settings.Enemies.DefaultInitialEnemyHealth,
            damageWeight: Settings.Enemies.Damage.InitialFireDemonDamageWeight,
            killValuePoints: Settings.Enemies.KillValues.FireDemonKillValuePoints,
            tempo: 1000,
            run: function(initialSpeed, acceleration){
                  initialSpeed = initialSpeed || Settings.Enemies.SpeedOptions.FireDemonTimeToCrossField;
                  acceleration = acceleration || Settings.Enemies.FireDemonRunAcceleration;
                  acceleration = this.health > (Settings.Enemies.DefaultInitialEnemyHealth * 2 / 3) ? (acceleration + acceleration * 0.5) : this.health < (Settings.DefaultInitialEnemyHealth / 3) ? acceleration - acceleration * 0.5 : acceleration;
                  this.duration = acceleration > 1 && this.duration > 25 ? --this.duration : ++this.duration;
                  this.tempo *= acceleration;
                  this.currentFieldRunoverTime = this.currentFieldRunoverTime < Settings.Enemies.SpeedOptions.FireDemonMinTimeToCrossField ? Settings.Enemies.SpeedOptions.FireDemonMinTimeToCrossField : (initialSpeed - this.tempo);
                  if(this.currentFieldRunoverTime < Settings.Enemies.SpeedOptions.FireDemonMinTimeToCrossField) {this.currentFieldRunoverTime = Settings.Enemies.SpeedOptions.FireDemonMinTimeToCrossField;}
                  if(this.health < Settings.Enemies.DefaultInitialEnemyHealth / 4 && this.currentFieldRunoverTime === Settings.Enemies.SpeedOptions.FireDemonMinTimeToCrossField) { this.currentFieldRunoverTime *= 4; }
                  let y = Math.random() * Settings.General.PlayFieldLength;
                  actions.moveToPoint(this, 0, y, this.currentFieldRunoverTime, undefined,
                     Settings.General.PlayFieldLength, Settings.General.PlayFieldWidth, function(){
                        this.x = Settings.General.PlayFieldWidth;
                        this.run();
                   });
               }
        });

        fireDemon.id = 0;
        field.addChild(fireDemon);

        var jinn = field.display.sprite({
            x: 0,
            y: -20,
            origin: { x: "center", y: "center" },
            image: "img/jinn.png",
            generate: true,
            width: 60,
            height: 56,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            name: 'jinn',
            health: Settings.Enemies.DefaultInitialEnemyHealth,
            damageWeight: Settings.Enemies.Damage.InitialJinnDamageWeight,
            killValuePoints: Settings.Enemies.KillValues.JinnKillValuePoints,
            shoot: function(target){
                actions.fireOnTarget(this, target, fireBall, blast, Settings.Enemies.SpeedOptions.MaxTimeForFireBallToCrossField);
            }
        });

        jinn.id = 0;
        field.addChild(jinn);

        var fireBall = field.display.sprite({
            x: 0,
            y: -20,
            origin: { x: "center", y: "center" },
            image: "img/fireball.png",
            generate: true,
            width: 32,
            height: 24,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            name: 'fireball',
            damageWeight: Settings.Enemies.Damage.InitialFireballDamageWeight,
            playSound: function(){
                sounds.lazyLoadPlay('fireBallSound');
              }
            });

            fireBall.id = 0;
            field.addChild(fireBall);

        var blast = (function(){
            var explosion = field.display.sprite({
            x: -100,
            y: 0,
            origin: { x: "center", y: "center" },
            image: "img/explosion3.png",
            generate: true,
            width: 64,
            height: 62,
            direction: "x",
            duration: Settings.General.DefaultSpriteDuration,
            // frame: 1,
            loop: false,
            name: 'explosion',
            damageWeight: Settings.Player.DefaultExplosionDamageWeight,
            playSound: function(){
                sounds.lazyLoadPlay('explosion5');
              }
            });

            explosion.id = 0;
            field.addChild(explosion);

            function explode(target){
                actions.explode(explosion, target, Settings.Enemies.FireBallExplosionDuration);
            }

            return {
                explode: explode
            }
        }());

        return {
            mummy: mummy,
            jinn: jinn,
            fireDemon: fireDemon,
            blast: blast,
        };

    }());

    return {
        creatures: creatures
    }

}(gameController.playField, actionController, soundsController));
