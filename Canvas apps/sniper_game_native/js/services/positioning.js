var positioningService = (function(){

    var mousePoint = {
        x: 0,
        y: 0
    };

    function getMouseCoordinates(){
        $('#canvas').on('mousemove', function (event) {
            mousePoint.x = parseFloat(event.clientX);
            mousePoint.y = parseFloat(event.clientY);
        });

        return mousePoint;
    }

    function calculateAngle(initialCoordinates, potentialCoordinates){
        potentialCoordinates = potentialCoordinates || getMouseCoordinates();

        if(!potentialCoordinates || !(potentialCoordinates.x && potentialCoordinates.y)){
            return;
        }
        var theta = parseFloat(Math.atan((potentialCoordinates.y - initialCoordinates.y)/(potentialCoordinates.x - initialCoordinates.x)));
        return theta;
    }

    function isSamePlace(pointA, pointB){
        return pointA.x === pointB.x && pointA.y === pointB.y;
    }

    function calculateAngleInRelation(pointA, pointB) {
        // Point 1 in relation to point 2

        pointB = pointB || mousePoint;

        var xdiff = Math.abs(pointB.x - pointA.x);
        var ydiff = Math.abs(pointB.y - pointA.y);
        var deg = 361;
        if ( (pointB.x > pointA.x) && (pointB.y < pointA.y) ) {
            // Quadrant 1
            deg = -((Math.atan((ydiff * Math.PI / 180) / (xdiff * Math.PI / 180))) * 180/Math.PI);

        } else if ( (pointB.x > pointA.x) && (pointB.y > pointA.y) ) {
            // Quadrant 2
            deg = ((Math.atan((ydiff * Math.PI / 180) / (xdiff * Math.PI / 180))) * 180/Math.PI);

        } else if ( (pointB.x < pointA.x) && (pointB.y > pointA.y) ) {
            // Quadrant 3
            deg = 90 + ((Math.atan((xdiff * Math.PI / 180) / (ydiff * Math.PI / 180))) * 180/Math.PI);

        } else if ( (pointB.x < pointA.x) && (pointB.y < pointA.y) ) {
            // Quadrant 4
            deg = 180 + ((Math.atan((xdiff * Math.PI / 180) / (ydiff * Math.PI / 180))) * 180/Math.PI);

        } else if ((pointB.x == pointA.x) && (pointB.y < pointA.y)){
            deg = -90;
        } else if ((pointB.x == pointA.x) && (pointB.y > pointA.y)) {
            deg = 90;
        } else if ((pointB.y == pointA.y) && (pointB.x > pointA.x)) {
            deg = 0;
        } else if ((pointB.y == pointB.y) && (pointB.x < pointA.x)) {
            deg = 180;
        }
        if (deg == 361) {
            deg = 0;
        }
        return deg;
    }

    function getRouteData(pointA, pointB){
        var xDiff = pointB.x - pointA.x,
            yDiff = pointB.y - pointA.y;

        var longer = Math.abs(xDiff) > Math.abs(yDiff) ? xDiff : yDiff;
        var ratio = Math.abs(longer) === Math.abs(xDiff) ? Math.abs(longer) / Math.abs(yDiff) : Math.abs(longer) / Math.abs(xDiff);

        return {
            ratio: Math.floor(ratio),
            xIsLongerDiagonal: Math.abs(longer) === Math.abs(xDiff),
            xIsPositive: xDiff > 0,
            yIsPositive: yDiff > 0,
            longer: this.xIsLongerDiagonal ? xDiff : yDiff,
            shorter: this.xIsLongerDiagonal ? yDiff : xDiff,
            step: +0
        }
    }


    return {
        getMouseCoordinates: getMouseCoordinates,
        calculateAngle: calculateAngle,
        isSamePlace: isSamePlace,
        mousePoint: getMouseCoordinates(),
        calculateAngleInRelation: calculateAngleInRelation,
        getRouteData: getRouteData
    }
}());