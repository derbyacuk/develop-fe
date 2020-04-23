import $ from 'jquery'
import lightgallery from 'lightgallery'
import '../../../node_modules/lg-video/dist/lg-video.min.js'

$('.media-gallery-images').lightGallery({
    download: false,
    videoMaxWidth: '1080px',
    youtubePlayerParams: {
        modestbranding: 1,
        showinfo: 1,
        rel: 0,
        controls: 1
    },
});


