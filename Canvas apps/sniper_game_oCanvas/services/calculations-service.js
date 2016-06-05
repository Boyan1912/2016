var calculationsService = (function(){

    function getAngle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

        return theta;
    }

    function calcSpeedOfTravelInSeconds(eX, mX, eY, mY, maxTime, sensitivity, maxLength, maxWidth){
        maxLength = maxLength || Settings.PlayFieldLength;
        maxWidth = maxWidth || Settings.PlayFieldWidth;
        maxTime = maxTime || Settings.MaxTimeForPlayerToCrossField;
        sensitivity = sensitivity || Settings.DefaultSpeedSensitivity;

        var diffX = Math.abs(eX - mX),
            diffY = Math.abs(eY - mY),
            distance = (diffX + diffY) / 2,
            maxDistance = (maxLength + maxWidth) / 2,
            fraction = maxDistance / distance,
            result = maxTime / fraction;

            return parseInt(result);
    }

    function isHit(model, hitter, tolerance){
        if((!model || !hitter)
        // || (model.name === 'fire_demon' && hitter.name === 'fire') ||
        // (model.name === 'fire' && hitter.name === 'fire_demon')
        ){
            return false;
        }

        return (Math.abs(hitter.x - model.x) + Math.abs(hitter.y - model.y)) / 2 <= tolerance;
    }

    function calculateDamage(model, hitter, tolerance){
        var unit = tolerance * 1 / 3,
            proximity = (Math.abs(hitter.x - model.x) + Math.abs(hitter.y - model.y)) / 2,
            damage;

        if(proximity < unit){
            damage = hitter.damageWeight;
        }else if(proximity < unit * 2){
            damage = (2 / 3) * hitter.damageWeight;
        }else{
            damage = (1 / 3) * hitter.damageWeight;
        }

        return damage;
    }

    function detectManyToOneCollision(model, hitters, tolerance){
        var damage = 0;
        var previousId;
        for (var i = 0; i < hitters.length; i++) {
            var hitter = hitters[i];
            if (isHit(model, hitter, tolerance)){
                if(hitter.name === 'health_kit' && model.name === 'sniper' && hitter.id !== previousId && hitter.healPoints){
                    previousId = hitter.id;
                    console.log(hitter.id);
                    model.health += hitter.healPoints;
                    hitter.healPoints = 0;
                    soundsController.lazyLoadPlay('success1');
                    hitter.remove(true);
                    // continue;
                }
                soundsController.playSoundOnModelContact(model, hitter);
                gameController.displayModelInfo(hitter);
                damage += calculateDamage(model, hitter, tolerance);
            }
        }

        return damage;
    }

    function positionWeaponInFrontOfModel(weapon, model, angle){
        weapon.x = angle < -90 ? model.x - 40 : angle > 90 ? model.x - 40 : model.x + 30;
        weapon.y = angle < 0 ? model.y - 40 : model.y + 30;
    }

    return {
        getAngle: getAngle,
        calcSpeedOfTravelInSeconds: calcSpeedOfTravelInSeconds,
        positionWeaponInFrontOfModel: positionWeaponInFrontOfModel,
        isHit: isHit,
        calculateDamage: calculateDamage,
        detectManyToOneCollision: detectManyToOneCollision
    }
}());
