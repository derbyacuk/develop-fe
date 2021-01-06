import $ from 'jquery'
import lightgallery from 'lightgallery'
import '../../../node_modules/lg-video/dist/lg-video.min.js'

$('.media-gallery-images-ul').lightGallery({
    download: false,
    selector: 'li a',
    videoMaxWidth: '1080px',
    youtubePlayerParams: {
        modestbranding: 1,
        showinfo: 1,
        rel: 0,
        controls: 1
    },
});

$('.media-gallery-images').on('onBeforeSlide.lg',function(event){
    let videos = document.querySelectorAll(".lg-video > iframe");

    for(let video of videos) {
        let src = video.getAttribute("src");

        src = src.replace('youtube.com', 'youtube-nocookie.com');
        video.setAttribute("src", src);
    }

});