//FYI this doesn't use stickybits as that constraints to the container an element is within
if ($('.sticky-call-to-action-container').length) {

    $(window).on('scroll resize', () => {

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

        var sectionNavigation = $('.section-navigation');
        if (sectionNavigation.length > 0) {
            // if we're up to section nav add class to allow cta to sit alongside section nav
            if (scroll >= (sectionNavigation.offset().top - $('.sticky-call-to-action').height())) {
                $('.sticky-call-to-action-fixed').addClass('sticky-call-to-action-fixed-with-section-navigation');
                // if under 600px the section nav is full width so set our margin to take height of section nav into account
                if ($(window).width() < 600) {
                    $('.sticky-call-to-action-fixed').css('marginTop', sectionNavigation.height());
                } else {
                    $('.sticky-call-to-action-fixed').css('marginTop', 0);
                }
            } else {
                $('.sticky-call-to-action-fixed').removeClass('sticky-call-to-action-fixed-with-section-navigation');
                $('.sticky-call-to-action-fixed').css('marginTop', 0);
            }
        }
    })
}
