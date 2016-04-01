var positioningService = (function(){

    function getAngle(cx, cy, ex, ey) {
        var dy = ey - cy;
        var dx = ex - cx;
        var theta = Math.atan2(dy, dx); // range (-PI, PI]
        theta *= 180 / Math.PI; // rads to degs, range (-180, 180]

        return theta;
    }

    return {
        getAngle: getAngle
    }
}());