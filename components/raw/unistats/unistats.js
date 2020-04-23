// Kick off the load on page open to load any open accordion items
(function(){

	$('.unistats').find('.accordion-tab').each(function() {

		if ($(this).find('.accordion-tab-content').first().height()) {
			loadUnistats($(this));
		}
	});
})();


$('.unistats').find('.accordion-tab').on('click', function(e) {

	if ($(this).find('.unistats-widget').first().attr('src') === 'about:blank') {
		loadUnistats($(this));
	}
});

/**
 * loadUnitstats - lazy load the Unistats iframe by changing the src attribute.
 * This needs to be set to "about:blank" initially as a blank src is not valid
 * and will result in the iframe loading the containing page.
 * 
 * @param  tab - Object - jQuery element representing the accorion tab
 */
function loadUnistats(tab) {
	var target   		 = $(tab).find('.unistats-widget').first();
	var course 			 = target.data('course');
	var mode 			 = target.data('mode');
	var targetUri      	 = 'https://discoveruni.gov.uk/widget/10007851/' + course + '/responsive/small/en_GB/' + mode;

	target.attr('src', targetUri);
}