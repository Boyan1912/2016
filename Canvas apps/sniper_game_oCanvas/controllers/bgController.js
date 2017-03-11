var bgController = (function (models) {

    var $bg = $('#background'),
        changeBgTimeout,
        animated = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        $videoTag = $('#yt-video');

    function getVideoLink(videoObj) {
        return Settings.General.DefaultBgVideoUrlPrefix + videoObj.videoId + Settings.General.DefaultBgVideoUrlOptionsSuffix + '&start=' + videoObj.start + '&end=' + videoObj.end + '&version=3 + &vq=' + videoObj.quality;
    }

    // function startBgVideo(link) {
    //     link = link || getVideoLink(getRandomVideoBg());
    //
    //     loopsController.freezeEnemies(7500);
    //     $videoTag.attr('src', link);
    //     setTimeout(function () {
    //         $videoTag.fadeIn(4000);
    //     }, 7500);
    // }
    
    function changeBgVideoAnimated(videoObj, animOut, animIn) {
        animOut = animOut || AnimationTypes.filter(function (item) {
                return item.indexOf('Out') > 0;
            })[getRandomInt(15)];
        animIn = animIn || AnimationTypes.filter(function (item) {
                return item.indexOf('In') > 0;
            })[getRandomInt(15)];

        var link = getVideoLink(videoObj);

        $bg.addClass('changeVideoBg ' + animOut)
            .one(animated, function () {
                $videoTag.attr('src', link);
                $bg.css('display', 'none');
                $bg.removeClass(animOut);
            });
        setTimeout(function () {
            $bg.addClass(animIn)
                .css('display', 'block')
                .one(animated, function () {
                    $bg.removeClass(animIn);
                })
        }, 7500)
    }

    function changeVideoBgFading(videoObj, duration) {
        videoObj = videoObj || getRandomVideoBg();
        var link = getVideoLink(videoObj);
        duration = duration || 3000;
        $videoTag.fadeOut(duration, function () {
            loopsController.freezeEnemies(6000);
            $videoTag.css('display', 'none')
                     .attr('src', link);
                     setTimeout(function () {
                         $videoTag.fadeIn(duration);
                     }, 5000);
        });
    }

    function animateBgOnce(style, callBack) {
        $bg.addClass('animated ' + style)
            .one(animated, function () {
                $bg.removeClass('animated ' + style);
                if (callBack) callBack();
            })
    }

    function animateBg(style) {
        style = style || AnimationTypes[getRandomInt(15)];
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

    function getRandomVideoBg(sourceIndex, numberPiece) {
        var rndIndex = sourceIndex || getRandomInt(6);
        var mix = musicSources['src' + rndIndex];

        rndIndex = numberPiece || getRandomInt(7);
        var piece = mix['time' + rndIndex];
        while (!piece){
            piece = mix['time' + --rndIndex];
        }

        var videoOptions = {videoId: mix.videoId, start: piece.start, end: piece.end, quality: Settings.General.DefaultBgVideoQuality};

        return videoOptions;
    }

    function changeBgRandomly(animated, force, fadeDur) {
        var videoOptions = getRandomVideoBg();

        if (animated)
            changeBgVideoAnimated(videoOptions);
        else
            changeVideoBgFading(videoOptions, fadeDur);

        if (force) clearTimeout(changeBgTimeout);

        var duration = (videoOptions.end - videoOptions.start) * 1000;

        changeBgTimeout = setTimeout(function(){
            changeBgRandomly(getRandomInt(10) > 6);
        }, duration);
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
        animateBgOnce: animateBgOnce,
        // startBgVideo: startBgVideo
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