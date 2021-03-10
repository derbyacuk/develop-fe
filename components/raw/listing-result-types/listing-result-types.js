import $ from 'jquery'
import lightgallery from 'lightgallery'
import '../../../../node_modules/lg-video/dist/lg-video.min.js'

function applyLightGallery() {
    $('.search-result-video .search-result-image, .search-result-video .search-result-content, .search-result-360-view .search-result-image, .search-result-360-view .search-result-content').each(function(){

        $(this).lightGallery({
            selector: 'a',
            download: false,
            videoMaxWidth: '1080px',
            youtubePlayerParams: {
                modestbranding: 1,
                showinfo: 1,
                rel: 0,
                controls: 1
            },
            getCaptionFromTitleOrAlt: false,
            iframeMaxWidth: '100%'
        });

        $(this).on('onAfterOpen.lg',function(event){
            let target = document.querySelectorAll(".lg-video > iframe")[0];
            let src = target.getAttribute("src");

            src = src.replace('youtube', 'youtube-nocookie');
            target.setAttribute("src", src);

        });
    });

    if (openVideo) {
        
        if (document.querySelector('.search-page-results-grid-section > .search-result-wrapper > .search-result')) {
            if (document.querySelector('.search-page-results-grid-section > .search-result-wrapper > .search-result').classList.contains('search-result-video')) {
            document.querySelector('.search-result-video > .search-result-image > a').click();
            console.log(openVideo);
            openVideo = false;
            }
        }
    }
    
}

applyLightGallery();

$(document).on('dod-items-updated', () => {
    applyLightGallery();
});