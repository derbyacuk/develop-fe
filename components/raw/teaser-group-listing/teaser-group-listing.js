import $ from "jquery";
import masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

if ($('.teaser-listing-container').length > 0) {
  var loaderMarkup = '<div class="teaser-loader"><div class="spinner"></div></div>';

  (function(){
  	$('.teaser-listing-container').prepend(loaderMarkup);
  })();

  var msnry = new masonry( '.teaser-listing', {
    // options
    horizontalOrder: true,
    columnWidth: '.masonry-sizer',
    gutter: ".gutter-sizer",
    initLayout: false,
    isResizable: true,
  });

  // element
  imagesLoaded( document.querySelector('.teaser-listing'), function( instance ) {
    msnry.layout();
  });

  msnry.on('layoutComplete', function() {
  setTimeout(function (){
  	$('.teaser-loader').fadeOut(1000, function(){
  		$(this).remove();
  	});
  }, 2000);
  });
}