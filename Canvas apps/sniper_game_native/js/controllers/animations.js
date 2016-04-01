var animations = (function(){

    function animateStart(element){
        $(element).addClass(CONSTANTS.DefaultStartScreenAnimationType)
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).remove();
            })
    }

    function loop(func, resreshRate){
        resreshRate = resreshRate || CONSTANTS.RefreshFrequency;
        if (!func){
            return;
        }

        return setInterval(func, resreshRate);
    }

    function stopLoop(intervalId){
        clearInterval(intervalId);
    }

    return{
        animateStart: animateStart,
        loop: loop,
        stopLoop: stopLoop
    }

}());