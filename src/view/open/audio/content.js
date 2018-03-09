(function() {
    var ap1 = new APlayer({
        element: document.getElementById('onlinefs-players'),
        narrow: false,
        autoplay: true,
        showlrc: false,
        mutex: true,
        theme: '#e6d0b2',
        preload: 'metadata',
        mode: 'circulation',
        music: {
            title: 'Preparation',
            author: '',
            url: '/getFileContext?type=stream&id=' + $.queryString.id,
            // pic: 'http://devtest.qiniudn.com/Preparation.jpg'
        }
    });

})();