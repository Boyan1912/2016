var bgController = (function (models) {

    var $bg = $('#background'),
        changeBgTimeout,
        animated = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        $videoTag = $('#yt-video');

    function getVideoLink(videoObj) {
        return Settings.General.DefaultBgVideoUrlPrefix + videoObj.videoId + Settings.General.DefaultBgVideoUrlOptionsSuffix + '&start=' + videoObj.startTime + '&end=' + videoObj.endTime + '&version=3 + &vq=' + videoObj.quality;
    }

    function changeBgVideoAnimated(videoObj, animOut, animIn) {
        console.log('changeBgVideoAnimated');
        animOut = animOut || AnimationTypes.filter(function (item) {
                return item.indexOf('Out') > 0;
            })[getRandomInt(10)];
        animIn = animIn || AnimationTypes.filter(function (item) {
                return item.indexOf('In') > 0;
            })[getRandomInt(10)];

        var link = getVideoLink(videoObj);

        $bg.addClass('changeVideoBg ' + animOut)
            .one(animated, function () {
                $videoTag.attr('src', link);
                $bg.css('display', 'none');
                $bg.attr('class', 'canvas');
                // $videoTag.css('display', 'none');

                // $bg.addClass('changeVideoBg ' + animIn, function () {
                //     // $videoTag.css('display', 'block');
                //     $bg.attr('class', 'canvas');
                // });
            });
        setTimeout(function () {
            $bg.css('display', 'block');
            $bg.addClass('changeVideoBg ' + animIn)
                .one(animated, function () {
                    $bg.removeClass('changeVideoBg ' + animIn);
                })
        }, 8000)
    }

    function changeVideoBgFading(videoObj, duration) {
        var link = getVideoLink(videoObj);
        duration = duration || 5000;
        $videoTag.fadeOut(duration, function () {
            $videoTag.css('display', 'none');
            $videoTag.attr('src', link);
            setTimeout(function () {
                $videoTag.css('display', 'block');
                $videoTag.fadeIn(duration);
            }, 5000);
        })
    }

    function animateBgOnce(style, callBack) {
        $bg.addClass('animated ' + style)
            .one(animated, function () {
                $bg.removeClass('animated ' + style);
                if (callBack) callBack();
            })
    }

    function animateBg(style) {
        style = style || AnimationTypes[getRandomInt(9)];
        console.log(style);
        $bg.addClass('perpetually-animated ' + style.trim())
    }

    function stopBgAnim(style) {
        $bg.removeClass('perpetually-animated')
            .removeClass('animated')
            .removeClass('infinite')
            .removeClass(style.trim());
    }

    function switchAnimation(oldAnim, newAnim) {
        $bg.removeClass(oldAnim.trim());
        $bg.addClass(newAnim.trim());
        return $bg;
    }

    function hideBackground(duration) {
        duration = duration || 500;
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

    function getRandomVideoBg() {
        var rndIndex = getRandomInt(5);
        var mix = musicSources['src' + rndIndex];

        rndIndex = getRandomInt(7);
        var piece = mix['time' + rndIndex];
        while (!piece){
            piece = mix['time' + --rndIndex];
        }

        var videoOptions = {videoId: mix.videoId, start: piece.start, end: piece.end, quality: Settings.General.DefaultBgVideoQuality};

        return videoOptions;
    }

    function changeBgRandomly(animated, force, fadeDur) {
        console.log('changeBgRandomly');
        var videoOptions = getRandomVideoBg();

        if (animated)
            changeBgVideoAnimated(videoOptions);
        else
            changeVideoBgFading(videoOptions, fadeDur);

        // if (force) clearTimeout(changeBgTimeout);

        var duration = (videoOptions.end - videoOptions.start) * 1000;

        // changeBgTimeout = setTimeout(function(){
        //     changeBgRandomly(getRandomInt(10) > 6);
        // }, duration);
    }

    return {
        changeBgVideoAnimated: changeBgVideoAnimated,
        changeVideoBgFading: changeVideoBgFading,
        animateBg: animateBg,
        stopBgAnim: stopBgAnim,
        switchAnimation: switchAnimation,
        hideBackground: hideBackground,
        showBackground: showBackground,
        switchOnOff: switchOnOff,
        optimizePerformance: optimizePerformance,
        changeBgRandomly: changeBgRandomly,
        animateBgOnce: animateBgOnce
    };

    // YOUTUBE PLAYER

    // function changeBgVideoAnimated(videoObj, animOut, animIn) {
    //     animOut = animOut || AnimationTypes[getRandomInt(AnimationTypes.length)];
    //     animIn = animIn || AnimationTypes[getRandomInt(AnimationTypes.length)];
    //
    //     animateBgOnce(animOut, function () {
    //         animateBgOnce(animIn);
    //         startBgVideo(videoObj);
    //     });
    // }
    //
    // function startBgVideo(videoObj) {
        // ytPlayer.loadVideoById({
        //     url: videoObj.videoId,
        //     startSeconds: videoObj.start,
        //     endSeconds: videoObj.end,
        //     suggestedQuality: videoObj.quality
        // });
        // ytPlayer.playVideo();
        // ytPlayer.fadeVolumeTo(100, 50);
    // }
    // function changeVideoBgFading(videoObj, duration) {
    //     duration = duration || 7000;

    // ytPlayer.fadeVolumeTo(0, 100);
    // hideBackground(duration);
    // setTimeout(function () {
    //     showBackground(duration);
    //     ytPlayer.fadeVolumeTo(100, 100);
    //     startBgVideo(videoObj);
    // }, duration - 100);
    // }

    // function getUrlByVideoId(videoId) {
    //     return Settings.General.DefaultBgVideoUrlPrefix + videoId + Settings.General.DefaultBgVideoUrlOptionsSuffix;
    // }

    // ytPlayer.fadeVolumeTo = function (to, updateFrequency) {
    //     to = parseInt(to);
    //     var currentVolume = ytPlayer.getVolume();
    //     var isFadingOut = to < currentVolume;
    //     var fadeInterval = setInterval(function () {
    //         if (isFadingOut){
    //             currentVolume -= 1;
    //         }else {
    //             currentVolume += 1;
    //         }
    //         ytPlayer.setVolume(currentVolume);
    //         if (currentVolume < 1 || currentVolume == to){
    //             clearInterval(fadeInterval);
    //         }
    //     }, updateFrequency);
    // };

}(modelsService));