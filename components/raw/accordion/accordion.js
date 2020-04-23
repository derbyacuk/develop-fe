import houdini from './houdini.custom'

/**
 * Polyfil this function (swapping out for jquery long term would be nice)
 */
const forEach = function (array, callback, scope) {
    for (let i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
    }
};

/**
 * Custom Events
 */
const ACCORDION_OPEN = 'ACCORDION_OPEN'
const ACCORDION_CLOSE = 'ACCORDION_CLOSE'

/**
 * When the page hash changes, scroll to that position.
 */
function scrollIntoView() {
    const hash = window.location.hash;
    if (!hash) {
        return;
    }
    var toggle = document.querySelector(hash + '-label');
    if (toggle) {
        window.scrollTo(0, toggle.offsetTop);
    }
}

const accordionElementExistsOnPage = document.querySelector('.accordion') != undefined;
if (accordionElementExistsOnPage) {
    const hash = window.location.hash;
    if (hash) {
        // auto-close any open panels which do not match the current hash
        const toggle = document.querySelectorAll('[data-collapse]' + ':not([href*="' + hash + '"])');
        forEach(toggle, function (index, value) {
            value.classList.remove('active');
            value.setAttribute('aria-expanded', 'false');
            const elementId = value.getAttribute('aria-controls');
            const content = document.querySelector('[id="' + elementId + '"]');
            if (content) {
                content.classList.remove('active');
            }
        });
    }

    window.addEventListener('hashchange', scrollIntoView, false);

    houdini.init({
        callbackOpen: function (content, toggle) {
            // remove the focus rect created by houdinijs forcing focus to the new panel
            content.blur();

            // set a new max-height to the content height (max height can be animaed, height alone cannot)
            content.style['max-height'] = content.scrollHeight + 'px';

            if (toggle) {
                // update the aria metadata for this component to reflect the new state
                toggle.setAttribute('aria-expanded', 'true');
                // dispatch a custom event to allow other components to react to the panel being opened
                $('.main-navigation-mobile').trigger(ACCORDION_OPEN, toggle.getAttribute('aria-controls'));
            }
        },
        callbackClose: function (content, toggle) {
            // set a new max-height to allow the panel to be animated closed
            content.style['max-height'] = 0;
            if (toggle) {
                // if the hash is currently in the url and we've just closed the panel, remove the hash
                if (toggle.getAttribute('aria-expanded') == 'true' && '#' + toggle.getAttribute('aria-controls') === window.location.hash) {
                    history.pushState("", document.title, window.location.pathname + window.location.search);
                }
                // update the aria metadata for this component to reflect the new state
                toggle.setAttribute('aria-expanded', 'false');
                // remove the focus rect created by houdinijs forcing focus to the new panel
                toggle.blur();
                // dispatch a custom event to allow other components to react to the panel being closed
                $('.main-navigation-mobile').trigger(ACCORDION_CLOSE, toggle.getAttribute('aria-controls'));
            } else {
                // dispatch a custom event to allow other components to react to the panel being closed
                $('.main-navigation-mobile').trigger(ACCORDION_CLOSE);
            }
        }
    });
}
