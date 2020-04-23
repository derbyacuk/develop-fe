//FYI this doesn't use stickybits as that constraints to the container an element is within
if ($('.sticky-call-to-action-container').length) {

    const breakpoint = 600; // the target width at which the sticky behaviours should apply (tablet and above)

    $(window).on('scroll', () => {
        if ($(window).width() < breakpoint) {
            return false;
        }
        var scroll = $(window).scrollTop() + 20;
        if (scroll > $('.sticky-call-to-action-container').offset().top) {
            $('.sticky-call-to-action').addClass('sticky-call-to-action-hidden');
            $('.sticky-call-to-action-fixed').removeClass('sticky-call-to-action-hidden');
        } else {
            $('.sticky-call-to-action').removeClass('sticky-call-to-action-hidden');
            $('.sticky-call-to-action-fixed').addClass('sticky-call-to-action-hidden');
        }

        var anchorLinks = $('.anchor-links');
        if (anchorLinks.length > 0) {
            if (scroll > anchorLinks.offset().top) {
                $('.sticky-call-to-action-fixed').css('marginTop', anchorLinks.height())
            } else {
                $('.sticky-call-to-action-fixed').css('marginTop', 0)
            }
        }
    })

    $(window).on('resize', () => {
        if ($(window).width() < breakpoint) {
            $('.sticky-call-to-action').removeClass('sticky-call-to-action-hidden');
            $('.sticky-call-to-action-fixed').addClass('sticky-call-to-action-hidden');
        }
    })
}
