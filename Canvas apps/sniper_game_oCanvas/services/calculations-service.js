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
            unitOfMeasure = ((maxLength / sensitivity) + (maxWidth / sensitivity)) / 2,
            result;

        for(var i = sensitivity - 1; i >= 0 ; i--){
            var speedNormaliser = i + 1;
            if (distance > unitOfMeasure * i && distance <=  unitOfMeasure * speedNormaliser){
                result = maxTime * (speedNormaliser / sensitivity);
                break;
            }
        }

        return parseInt(result);
    }

    function isHit(model, hitter, tolerance){
        if(!model || !hitter){
            return false;
        }
        //console.log(obj.name);
        //console.log(model.name);
        return Math.abs(hitter.x - model.x) <= tolerance && Math.abs(hitter.y - model.y) <= tolerance;
    }

    function calculateDamage(model, hitter, tolerance){
        var unit = tolerance * 1 / 3,
            damage;
        if(Math.abs(hitter.x - model.x) < unit && Math.abs(hitter.y - model.y) < unit){
            damage = (1 / 3) * hitter.damageWeight;
        }else if(Math.abs(hitter.x - model.x) > unit * 2 && Math.abs(hitter.y - model.y) > unit * 2){
            damage = 1 * hitter.damageWeight;
        }else{
            damage = (2 / 3) * hitter.damageWeight;
        }

        return damage;
    }

    function detectManyToOneCollision(model, hitters, tolerance){
        var damage = 0;
        for (var i = 0; i < hitters.length; i++) {
            var hitter = hitters[i];
            if (isHit(model, hitter, tolerance)){
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