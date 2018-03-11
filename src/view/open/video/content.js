(function() {
    var names = $.queryString.name.split(".");
    var exname = names[names.length - 1];
    video = exname === 'flv' ? {
        url: "/getFileContext?type=stream&id=" + $.queryString.id,
        type: 'customFlv',
        customType: {
            'customFlv': function(video, player) {
                const flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: video.src,
                    withCredentials: true,
                    isLive: true
                });
                flvPlayer.attachMediaElement(video);
                flvPlayer.load(); //加载
            }
        }
    } : {
        url: "/getFileContext?type=stream&id=" + $.queryString.id,
    }
    var dp = new DPlayer({
        container: document.getElementById('onlinefs-dplayer'),
        screenshot: true,
        video: video
    });
})();