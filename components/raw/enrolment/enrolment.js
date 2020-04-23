import Fuse from 'fuse.js'

var list = $("#enrolment-table > tbody").first().find('tr');
$(list).hide();

var data = [];
var position = 0;
var searchThreshold = 3;

	$(list).each(function(){

		var course = $(this).find('td').first().text();
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

function restripeTable(target) {

  $(target).find("tbody > tr:visible").each(function(index, item){
      if (index % 2) {
        $(item).css({"background-color" : "#eee"});
      } else {
        $(item).css({"background-color" : "#fff"});
      }
  })
}

var fuse = new Fuse(data, options); // "list" is the item array

$('[name="q"]').on('keyup', function(){

    $(list).hide();

    if ($(this).val().length >= searchThreshold) {

        var results = fuse.search($(this).val());

        for (var i = 0; i < results.length; i++) {

            var result = results[i];
            var target = $(list)[result.position];
            $(target).show();
        }

        restripeTable($("#enrolment-table"));
    }
})