// // Not allowed to work without a server
//
// (function () {
//     // 2. This code loads the IFrame Player API code asynchronously.
//     var tag = document.createElement('script');
//
//     tag.src = "http://www.youtube.com/apiplayer?enablejsapi=1&version=3";
//     var firstScriptTag = document.getElementsByTagName('script')[0];
//     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
//
//     // 3. This function creates an <iframe> (and YouTube player)
//     //    after the API code downloads.
//     var ytPlayer;
//     function onYouTubeIframeAPIReady() {
//         ytPlayer = new YT.Player('yt-player', {
//             height: '600',
//             width: '1400',
//             autoplay: false,
//             events: {
//                 'onReady': onPlayerReady,
//             }
//         });
//     }
//
//     // 4. The API will call this function when the video player is ready.
//     function onPlayerReady(event) {
// //                event.target.playVideo();
//     }
// }());