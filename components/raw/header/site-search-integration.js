import { closeAllMenusExcept } from './menu-integration'

let timeoutReference;

function toggleSiteSearchPanel() {
    // if any other header menus are open, close them.
    closeAllMenusExcept();
    
    // make the search panel visible and active, to start it animating in
    $('.header-site-search-container').toggleClass('header-site-search-container-hidden').toggleClass('header-site-search-container-active');
    
    // set the header button state to reflect the state of the panel
    $('.header-navigation-button.js-header-navigation-search').toggleClass('active');

    if ($('.header-site-search-container').hasClass('header-site-search-container-active')) {

        if(timeoutReference) {
            clearTimeout(timeoutReference);
            timeoutReference = undefined;
        }
        // the panel animates in, but we don't want to focus until the animation is complete
        // if we do, the viewport focusses on the panel and scrolls the page oddly.
        timeoutReference = setTimeout(() => {
            $('.header-site-search-container .search-input').focus();
        }, 500)
    } else {
        // the hover state is the same as the focus state, so if we're closing the panel
        // we also need to shift the button focus as well.
        $(this).blur();
    }
}

export function hideSearch() {
    // reset the classes on the site search container panel
    $('.header-site-search-container')
    .addClass('header-site-search-container-hidden')
    .removeClass('header-site-search-container-active');
    
    // reset header button state
    $('.header-navigation-button.js-header-navigation-search')
    .removeClass('active')
    .blur();
}

$('.js-header-navigation-search').on('click', toggleSiteSearchPanel);