import Fuse from 'fuse.js'

var list = $("#search-listing-items").first().find('section');
var searchResultErrorElem = $("#search-listing-error");

var data = [];
var position = 0;
var searchThreshold = 3;

	$(list).each(function(){

		var course = $(this).find('h5').first().text();
        var tmpData = {};
        tmpData.course = course;
        tmpData.position = position;
		data.push(tmpData);
        position++;
	});

var options = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
    keys: [
    "course",
]
};

var fuse = new Fuse(data, options); // "list" is the item array

$('[name="q"]').on('keyup', function(){

    $(searchResultErrorElem).hide();

    if ($(this).val().length < 3) {

      $(list).show();

    } else {

      $(list).hide();

    }

    if ($(this).val().length >= searchThreshold) {

        var results = fuse.search($(this).val());

        if (results.length == 0) {

            $(searchResultErrorElem).show();

        }

        for (var i = 0; i < results.length; i++) {

            var result = results[i];
            var target = $(list)[result.position];
            $(target).show();
        }
    }
})