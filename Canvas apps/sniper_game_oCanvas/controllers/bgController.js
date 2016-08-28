var bgController = (function (models) {

    var $bg = $('#background'),
        $videoTag = $('#video'),
        animated = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        embedLinkPrefix = 'https://www.youtube.com/embed/',
        videoOptions = '?autoplay=1&controls=0&vq=tiny&frameborder=0&cc_load_policy=0&enablejsapi=1&iv_load_policy=3&modestbranding=1&rel=0',
        yTubePlayer = document.getElementById("movie_player");

    function getVideoLink(videoId, startTime, endTime) {
        return embedLinkPrefix + videoId + videoOptions + '&t=' + startTime + '&end=' + endTime;
    }

    function changeBgVideoAnimated(videoId, startTime, animOut, animIn) {
        videoId = 'utgpJHdawHY';
        startTime = 262;
        var link = getVideoLink(videoId, startTime);

        $bg.addClass('changeVideoBg animated ' + animOut)
            .one(animated, function () {
                $videoTag.attr('src', videoId);
                $bg.removeClass(animOut)
                    .addClass(animIn)
                    .one(animated, function () {
                        $bg.removeClass(animIn)
                            .fadeIn(3000);
                    })
            });
    }

    function changeVideoBgFading(newVideoId, duration) {
        var link = getVideoLink(newVideoId, startTime);
        duration = duration || 5000;

        $bg.fadeOut(duration, function () {
            $videoTag.attr('src', link);
            $bg.fadeIn(duration);
        })
    }

    function animateBg(style) {
        $bg.addClass('perpetually-animated animated infinite ' + style)
    }

    function stopBgAnim(style) {
        $bg.removeClass('perpetually-animated', 'animated', 'infinite', style)
            .removeClass('animated')
            .removeClass('infinite')
            .removeClass(style);
    }

    function hideBackground(duration) {
        duration = duration || 300;
        $bg.fadeOut(duration)
    }

    function showBackground(duration) {
        duration = duration || 1000;
        $bg.fadeIn(duration)
    }

    function switchOnOff(duration) {
        var countObjects = models.getAllEnemyModels().length + models.getAllActiveAndPotentialExplosions().length + models.getAllFires().length;
        if (countObjects >= Settings.GamePerformance.Constraints.MaxLoopingObjectsAllowedToDisplayBackground){
            hideBackground(duration);
        }else{
            showBackground(duration);
        }
    }

    function optimizePerformance() {
        setInterval(switchOnOff, 400);
    }


    
    return {
        changeBgVideoAnimated: changeBgVideoAnimated,
        changeVideoBgFading: changeVideoBgFading,
        animateBg: animateBg,
        stopBgAnim: stopBgAnim,
        hideBackground: hideBackground,
        showBackground: showBackground,
        switchOnOff: switchOnOff,
        optimizePerformance: optimizePerformance
    }
}(modelsService));