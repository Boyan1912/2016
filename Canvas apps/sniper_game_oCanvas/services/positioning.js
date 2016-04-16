var positioningService = (function(){

    function getAngle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

        return theta;
    }

    function calcNormalRocketTravelDuration(eX, mX, eY, mY, maxTime, sensitivity, maxLength, maxWidth){
        maxTime = maxTime || Constants.MaxTimeForRocketToCrossField;
        return calcSpeedOfTravelInSeconds(eX, mX, eY, mY, maxTime, sensitivity, maxLength, maxWidth);
    }

    function calcSpeedOfTravelInSeconds(eX, mX, eY, mY, maxTime, sensitivity, maxLength, maxWidth){
        maxLength = maxLength || Constants.PlayFieldLength;
        maxWidth = maxWidth || Constants.PlayFieldWidth;
        maxTime = maxTime || Constants.MaxTimeForPlayerToCrossField;
        sensitivity = sensitivity || Constants.DefaultSpeedSensitivity;

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

    return {
        getAngle: getAngle,
        calcSpeedOfTravelInSeconds: calcSpeedOfTravelInSeconds,
        calcFireShellTravelDuration: calcNormalRocketTravelDuration
    }
}());