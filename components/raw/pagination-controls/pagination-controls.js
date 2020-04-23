/*
    Bring our T4 out of the box pagination up to scratch pagination
/*/
$('.pagination-controls').each(function () {
	$('a', $(this)).each(function(){
		var text = $(this).html();
		if (text == '&gt;') {
			$(this).html('Next <i class="uod-icons uod-icons-chevron-right"></i>');
		}
		if (text == '&gt;&gt;') {
			$(this).html('Last <i class="uod-icons uod-icons-chevron-right"></i><i class="uod-icons uod-icons-chevron-right"></i>');
		} 
		if (text == '&lt;') {
			$(this).html('<i class="uod-icons uod-icons-chevron-left"></i> Prev');
		}
		if (text == '&lt;&lt;') {
			$(this).html('<i class="uod-icons uod-icons-chevron-left"></i><i class="uod-icons uod-icons-chevron-left"></i> First');
		}
		if ($('.button-overlay', $(this)).length == 0) {
			var text = $(this).html(); //get the text again incase it has changed
	        $(this).html(text + '<span class="button-overlay"><span>' + text + '</span></span>');
	    }
	});
});