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

    $(this).on('onAfterOpen.lg',function(event){
        let target = document.querySelectorAll(".lg-video > iframe")[0];
        let src = target.getAttribute("src");

        src = src.replace('youtube', 'youtube-nocookie');
        target.setAttribute("src", src);

    });
});