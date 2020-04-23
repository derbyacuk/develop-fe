import $ from 'jquery'
import stickybits from 'stickybits'

// Hide the "In this section" navigation element if it's empty
if (!$(".section-navigation-wrapper-inner-ul").length) {
	$(".section-navigation").hide();
}

$('.section-navigation-wrapper').hide();

$('.section-navigation-link').click(function (e) {
    e.preventDefault();
    $('.section-navigation-wrapper').slideToggle();
});

$('.section-navigation-wrapper > .uod-icons-cross').click(function (e) {
    e.preventDefault();
    $('.section-navigation-wrapper').slideUp();
});


stickybits('.section-navigation');
