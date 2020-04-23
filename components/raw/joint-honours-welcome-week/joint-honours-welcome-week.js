(function(){
	var values = [];

	$('#tables > [data-subject]').each(function(){

		var value = $(this).data('subject');
		values.push(value);
	});

	values.sort();

	for (var i = 0; i < values.length; i++) {

		var option1 = $('<option>', {
		    value: values[i],
		    text: values[i]
		});

		var option2 = $('<option>', {
		    value: values[i],
		    text: values[i]
		});

		$('#select-1').append(option1);
		$('#select-2').append(option2);
	}
})();

$('#select-1, #select-2').on('change', function(){
	var disabled = $(this).val();
	$("#comparison-table-links").empty();
	$('option').prop('disabled', false);
	$('select option[value=""]').prop('disabled', true);
	var nearestSelect = $(this).closest('.form-group').siblings('.form-group').find('select').first();
	nearestSelect.find('[value="' + disabled + '"]').first().prop('disabled', true);

	var subject1 = $('#select-1').val();
	var subject2 = $('#select-2').val();

	var subject1Heading = $('<h3></h3>').text(subject1);
	var subject2Heading = $('<h3></h3>').text(subject2);
	var compulsoryIntro = $('<p></p>').text("Compulsory Activities - you must attend these, they are a key part of your induction");
	var optionalIntro   = $('<p></p>').text("Optional Activities - you may need to choose which you do if any clash with your other subject");
	var subjectLinks    = "";
	// We need to get each table individually so we can swap out required and optional items
	var subject1Tables = $('[data-subject="'+subject1+'"]').first().find('.activities-container');
	var subject2Tables = $('[data-subject="'+subject2+'"]').first().find('.activities-container');

	if ($('#select-1').val() || $('#select-2').val()) {
		subjectLinks += "<p>You have selected ";
	}

	if ($('#select-1').val()) {
		subjectLinks += '<a href="#comparison-1">'+subject1+'</a>';
		$('#comparison-1').empty()
		.append(subject1Heading)
		.append(compulsoryIntro)
		.append($(subject1Tables[0]).clone())
		.append(optionalIntro)
		.append($(subject1Tables[1]).clone());
	}

	if ($('#select-2').val()) {

		if ($('#select-1').val()) {
			subjectLinks += " and ";
		}

		subjectLinks += '<a href="#comparison-2">'+subject2+'</a>';

		$('#comparison-2').empty()
		.append(subject2Heading)
		.append(compulsoryIntro.clone())
		.append($(subject2Tables[0]).clone())
		.append(optionalIntro.clone())
		.append($(subject2Tables[1]).clone());
	}

	if (subjectLinks.length) {
		subjectLinks += "</p>";
	}

	$("#comparison-table-links").append(subjectLinks);

});