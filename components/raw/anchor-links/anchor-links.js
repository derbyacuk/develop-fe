import gumshoe from 'gumshoe'
import 'smooth-scroll/dist/js/smooth-scroll.polyfills.js'
import SmoothScroll from 'smooth-scroll'
import stickybits from 'stickybits'

// only run the following code if there's an anchor links navigation on the page
let elementExistsOnPage = $('[data-gumshoe-header]').length > 0;
if (elementExistsOnPage) {
    // for linking the scroll position and the state of the navigation links
    gumshoe.init({
        offset: 40,
        callback: (nav) => {
            // if no navigation element is in focus, default to selecting the first one.
            if (!nav) {
                $('[data-gumshoe] li:first-child, [data-gumshoe] li:first-child a').each((el) => {
                    $(el).addClass('active')
                })
            }
        }
    });

    // make the navigation sticky
    stickybits('.anchor-links-container', {
        useStickyClasses: true
    });

    // toggle the expanded state of the mobile navigation
    $('.anchor-links-title-link, .anchor-links-title-toggle').on('click', (e) => {
        e.preventDefault(); // because we don't want the page to jump around
        $('.anchor-links').toggleClass('active');
        // $('.anchor-links-title-toggle-icon').toggleClass('uod-icons-menu');
        // $('.anchor-links-title-toggle-icon').toggleClass('uod-icons-cross');
    });

    // add functionality to the close button
    // $('.anchor-links-title-close').on('click', (e) => {
    //     e.preventDefault(); // because we don't want the page to jump around
    //     $('.anchor-links').removeClass('active');
    // });

    // add functionality to the links in mobile view
    $('.anchor-links-list-item-link').on('click', (e) => {
        $('.anchor-links').removeClass('active');
    });

    // for smooth scrolling behaviours when clicking links in the navigation
    new SmoothScroll('a[data-scroll]', {
        header: '[data-scroll-header]',
        offset: 40
    });
}
