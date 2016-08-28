window.originalSetInterval = window.setInterval;
window.originalClearInterval = window.clearInterval;
window.allLoops = [];
window.activeLoopsCount = 0;


window.setInterval = function(func, interval, activity)
{
    var loopObj = {
        activity: activity
    };
    window.activeLoopsCount++;
    window.allLoops.push(loopObj);
    // console.log('activeLoopsCount ', activeLoopsCount);
    return window.originalSetInterval(func, interval);
};

window.clearInterval = function(loopId, activity)
{
    // console.log('clearInterval: ', loopId);
    window.activeLoopsCount--;
    // console.log('activeLoopsCount ', window.activeLoopsCount);
    window.originalClearInterval(loopId);
};

function getRandomInt(float) {
    return parseInt(Math.random() * float);
}
