var CONSTANTS = (function(){

    return {
        DefaultStartScreenAnimationType: 'animated bounceOutUp',
        Canvas: document.getElementById('canvas'),
        RefreshFrequency: 20,
        ImagesData: [
            {
                name: 'explosion',
                path: 'images/explosion.png',
                frames: 34,
                width: 50,
                height: 50
            },
            {
                name: 'rocket',
                path: 'images/rocket.png',
                frames: 4,
                width: 50,
                height: 50
            },
            {
                name: 'sniper',
                path: 'images/sniperflipped.png',
                totalFrames: 8,
                width: 423,
                height: 63,
                ticksPerFrame: 2,
                coordinates: {
                    x: 0,
                    y: 0
                }
            }
        ]

    }

}());