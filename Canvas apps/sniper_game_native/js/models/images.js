var images = (function(){

    function loadImages(imagesInfo){
        imagesInfo = imagesInfo || [];

        var spriteImages = {};
        for (var i = 0; i < imagesInfo.length; i++){
            var imgName = imagesInfo[i].name;
            // create image object
            var img = new Image();
            img.src = imagesInfo[i].path;
            // create sprite object and add it to the result with its correct name
            spriteImages[imgName] = sprite({
                context: CONSTANTS.Canvas.getContext('2d'),
                width: imagesInfo[i].width,
                height: imagesInfo[i].height,
                image: img,
                ticksPerFrame: imagesInfo[i].ticksPerFrame,
                totalFrames: imagesInfo[i].totalFrames,
                coordinates: imagesInfo[i].coordinates
            });
        }

        return spriteImages;
    }

    function sprite (options) {

        var spriteObj = {},
            frameIndex = options.frameIndex || 1,
            tickCount = options.tickCount || 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            totalFrames = options.totalFrames || 1;

        spriteObj.context = options.context;
        spriteObj.width = options.width;
        spriteObj.height = options.height;
        spriteObj.image = options.image;
        spriteObj.coordinates = options.coordinates || {
                x : 0,
                y : 0
            };
        spriteObj.destination = options.coordinates;

        spriteObj.render = function () {

            // Draw the animation
            spriteObj.context.drawImage(
                spriteObj.image,
                frameIndex * spriteObj.width / totalFrames,
                spriteObj.coordinates.y,
                spriteObj.width / totalFrames,
                spriteObj.height,
                spriteObj.coordinates.x,
                spriteObj.coordinates.y,
                spriteObj.width / totalFrames,
                spriteObj.height
            );
        };

        function updateCounters() {
            tickCount = updateTickCount(tickCount, ticksPerFrame);
            if (!tickCount) {
                frameIndex = updateFrameIndex(frameIndex, totalFrames);
            }
        }

        spriteObj.visualizeMovement = function() {
            spriteObj.context.save();
            spriteObj.context.clearRect(0, 0, CONSTANTS.Canvas.width, CONSTANTS.Canvas.height);
            // Draw here

            spriteObj.coordinates = updateCoordinates(spriteObj.coordinates.x, spriteObj.coordinates.y);
            console.log(spriteObj.coordinates.x + ' object coordinates ' + spriteObj.coordinates.y);
            updateCounters();

            spriteObj.render();
            spriteObj.context.restore();
        };

        spriteObj.goTo = function (destination) {
            var loopId = animations.loop(spriteObj.visualizeMovement);
            if (move.validator.destinationReached(spriteObj.coordinates.x, spriteObj.coordinates.y)){
                animations.stopLoop(loopId);
            }
        };

        function updateCoordinates(x, y){

            move.routeData.step = move.routeData.step ? ++move.routeData.step : 1;
            var step = move.routeData.step,
                longer = move.routeData.longer,
                ratio = move.routeData.ratio;

            if (move.validator.noRouteData()){
                return;
            }
            if (move.validator.destinationReached(x, y)){
                move.routeData = {};
                return;
            }
            if (move.routeData.xIsLongerDiagonal  && move.validator.moveLongerDiagonal(step, longer) && move.routeData.xIsPositive){
                x += 1;
                if(move.validator.moveShorterDiagonal(step, ratio) && move.routeData.yIsPositive){
                    y +=1;
                }else if(move.validator.moveShorterDiagonal(step, ratio) && !move.routeData.yIsPositive){
                    y -=1;
                }
            }else if (move.routeData.xIsLongerDiagonal && move.validator.moveLongerDiagonal(step, longer)  && !move.routeData.xIsPositive){
                x -= 1;
                if(move.validator.moveShorterDiagonal(step, ratio) && move.routeData.yIsPositive){
                    y +=1;
                }else if(move.validator.moveShorterDiagonal(step, ratio) && !move.routeData.yIsPositive){
                    y -=1;
                }
            }else if (!move.routeData.xIsLongerDiagonal && move.validator.moveLongerDiagonal(step, longer) && move.routeData.yIsPositive){
                y += 1;
                if(move.validator.moveShorterDiagonal(step, ratio) && move.routeData.xIsPositive){
                    x +=1;
                }else if(move.validator.moveShorterDiagonal(step, ratio) && !move.routeData.xIsPositive){
                    x -=1;
                }
            }else if (!move.routeData.xIsLongerDiagonal && move.validator.moveLongerDiagonal(step, longer) && !move.routeData.yIsPositive){
                y -= 1;
                if(move.validator.moveShorterDiagonal(step, ratio) && move.routeData.xIsPositive){
                    x +=1;
                }else if(move.validator.moveShorterDiagonal(step, ratio) && !move.routeData.xIsPositive){
                    x -=1;
                }
            }

            if (x === move.destination.x){
                y = move.destination.y;
            }else if(y === move.destination.y){
                x = move.destination.x;
            }
            console.log('coor ' + x + ' ' + y);
            console.log('dest: ' + move.destination);

            return {
                x: x,
                y: y
            }
        }


        return spriteObj;
    }



    function updateTickCount(tickCount, ticksPerFrame) {
        tickCount = tickCount > ticksPerFrame ? 0 : ++tickCount;
        return tickCount;
    }

    function updateFrameIndex(frameIndex, totalFrames){
        frameIndex = frameIndex < totalFrames - 1 ? ++frameIndex : 0;
        return frameIndex;
    }

    return {
        sprites: loadImages(CONSTANTS.ImagesData)
    }

}());