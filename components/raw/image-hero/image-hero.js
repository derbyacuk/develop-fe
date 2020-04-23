import objectFitVideos from 'object-fit-videos';

/**
 * Detects when the page has been scrolled, and stops the looping scroll indicator animation
 */
function stopAnimatingIndicatorWhenScrolled(e) {
    // if we haven't scrolled, exit the function early.
    if (window.scrollY < 100) {
        return;
    }

    // find the indicator, and remove the class which makes it animate
    let scrollIndicator = document.querySelector('.image-hero-scroll-to-content-arrow-animate')
    if (scrollIndicator) {
        scrollIndicator.classList.remove('image-hero-scroll-to-content-arrow-animate');
    }

    // this code only needs to happen once, because it's all about removal, so when we've removed it, we stop listening.
    window.removeEventListener('scroll', stopAnimatingIndicatorWhenScrolled);
}

// we only want to run this code when a hero element is actually on the page, so do a quick detection for that.
let heroElementExistsOnPage = document.querySelector('.image-hero') != undefined;
if (heroElementExistsOnPage) {
    window.addEventListener('scroll', stopAnimatingIndicatorWhenScrolled);
}

$(document).ready(() => {
    objectFitVideos();
});
