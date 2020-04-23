function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

window.widgetId = 26780; // manually added
$(document).ready(function() {

	$('#social-hub-menu').on("change", function(){
		var newFilter = $(this).val();
		Stackla.WidgetManager.changeFilter(window.widgetId, newFilter);
	});
});

$(window).on('load', function() {
    var feedId = getUrlParameter('feed');

    if (feedId) {
        Stackla.WidgetManager.changeFilter(window.widgetId, feedId);
    }
});
