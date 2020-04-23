import { hideSearch } from './site-search-integration'

const menuContainerActive = 'header-dropdown-menu-container-active';

const headerMenuActiveClass = 'main-navigation-panel-active';
const headerMenuHiddenClass = 'main-navigation-panel-hidden';

const toggleMenu = (menuIdToShow) => {
    $('.header-navigation-menu-item a').removeClass('active')

    if (menuIdToShow) {

        const thisMenuIsAlreadyOpen = $(`#${menuIdToShow}`).hasClass(headerMenuActiveClass);

        if (thisMenuIsAlreadyOpen) {
            closeAllMenusExcept();
            closeMenu(menuIdToShow);
            $(`[aria-controls="${menuIdToShow}"]`).removeClass('active').blur();
        } else {
            closeAllMenusExcept(menuIdToShow);
            openMenu(menuIdToShow, true);
            $(`[aria-controls="${menuIdToShow}"]`).addClass('active');
        }
    } else {
        closeAllMenusExcept();
    }
}

export function closeAllMenusExcept(menuId) {
    if (!menuId) {
        $('.header-navigation-menu-item a').removeClass('active')
        $('.header-dropdown-menu-container').removeClass(menuContainerActive).css({
            minHeight: undefined
        })
    }
    $('.main-navigation-desktop-content').not(`#${menuId}`).removeClass(headerMenuActiveClass);
}

function closeMenu(menuId) {
    $(`#${menuId}`).removeClass(headerMenuActiveClass);
}

function openMenu(menuId, animated) {
    hideSearch();
    $('.header-dropdown-menu-container').addClass(menuContainerActive);

    setMinHeight();

    $(`#${menuId}`).addClass(headerMenuActiveClass).removeClass(headerMenuHiddenClass)
    $('.main-navigation-desktop-content').not(`#${menuId}`).addClass(headerMenuHiddenClass)
}

function setMinHeight() {
    if ($('.main-navigation-panel-content').length) {
        requestAnimationFrame(() => {
            var minHeight = $('.main-navigation-panel-content').height();
            if (minHeight > window.screen.availHeight) {
                $('.header-dropdown-menu-container').css({
                    minHeight: minHeight
                })
            }
        })
    }
}

// when a menu item is clicked, toggle its associated menu
$('.header-navigation-menu-item a').on('click', function (e) {
    if ($(this).parent().hasClass('has-dropdown')) {
        e.preventDefault();
    }
    toggleMenu($(this).attr('aria-controls'))
})

$('.main-navigation-close').on('click', function () {
    closeAllMenusExcept()
    const parentId = $(this).parents('.main-navigation-desktop-content').attr('id');
    closeMenu(parentId)
})

// open the mobile navigation when its button is clicked 
// (which also overlays the menu over the button, so we don't have to worry about toggle behaviours)
$('.header-navigation-mobile-menu').on('click', () => { openMenu() });

// whenever the accordion menus in the mobile navigation open, 
// we need to re-asses the minimum height of the menu so we don't crop any of the content.
$('.main-navigation-mobile').on('ACCORDION_OPEN', setMinHeight);

// whenever the window height changes, 
// we need to re-asses the minimum height of the menu so we don't crop any of the content.
$(window).on('resize', setMinHeight);

// on page load, we need to asses the minimum height of the menu so we don't crop any of the content.
setMinHeight();

$(window).on('resize', function () {
    var currentWidth = $(window).width();
    if (currentWidth > 768) {
        if ($('.' + headerMenuActiveClass).length === 0) {
            closeAllMenusExcept();
        }
    }
});