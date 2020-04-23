import $ from 'jquery'
import lightgallery from 'lightgallery'
import '../../../node_modules/lg-video/dist/lg-video.min.js'

$('.media-embed').each(function(){

    $(this).lightGallery({
        selector: '.media-embed-a',
        download: false,
        videoMaxWidth: '1080px',
        youtubePlayerParams: {
            modestbranding: 1,
            showinfo: 1,
            rel: 0,
            controls: 1
        },
        getCaptionFromTitleOrAlt: false,
        iframeMaxWidth: $('.media-embed-a', $(this)).attr('data-attr-iframe-max-width')
    });
});