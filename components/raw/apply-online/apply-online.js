$('.apply-online-course-list:not(.preselected)').hide();
$('.apply-online-course-list.preselected select').prop('required',true); 
$('#courseTypes').change(function(){
    var courseType = $(this).val();
    $('.apply-online-course-list').hide();
    $('.apply-online-course-list select').removeAttr('required');
    $('#' + courseType + '-apply-online-course-list').show();
    $('#' + courseType + '-apply-online-course-list select').prop('required',true); 
});

$('#apply-online-form').submit(function(e){
    e.preventDefault();

    var sectionId = $('.apply-online-course-select:visible option:selected').val(),
    programCode = $('.apply-online-course-select:visible option:selected').attr('data-program-code'),
    jointHonoursCode = $('.apply-online-course-select:visible option:selected').attr('data-joint-honours-code'),
    url = 'https://registration.derby.ac.uk/psp/HPRDOLA2/EMPLOYEE/EMPL/h/?tab=UD_OLA_COURSE_SELECTION&PGR=' + programCode;

    // if the program code doesn't contain a comma or a pipe we can go straight to the portal...
    // else we need to refresh the page
    if (typeof programCode !== "undefined" && programCode) {

        if (programCode.indexOf('|') !== -1 || programCode.indexOf(',') !== -1) {
        	url = '?section_id=' + sectionId;
        }

    	if (jointHonoursCode != '') {
	        url += '&PLN1=' + jointHonoursCode;
	    }
	    if (programCode.length > 1) {
	        window.location.href = url;
	    }
    }
});
