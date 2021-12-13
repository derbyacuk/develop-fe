var list = document.querySelectorAll("#search-results > li");
var searchInput = document.getElementById('quick-search-input');
var fuseCheckMaxCount = 5;
var fuseCheckCount = 0;

function hideItems () {
	list.forEach(item => {
		item.classList.add('hidden');
	})
}

function showItem (item) {
		item.classList.remove('hidden');
}
var data = [];
var position = 0;
var searchThreshold = 3;

	list.forEach(item => {
		var course = item.innerText;
		data.push(course);
	});

var options = {
	  shouldSort: true,
	  threshold: 0.3,
	  location: 0,
	  distance: 100,
	  maxPatternLength: 32,
	  minMatchCharLength: 2,
};

(() => {
	searchInput.removeAttribute('disabled');
	
	var fuse = new Fuse(data, options); // "list" is the item array

	searchInput.addEventListener('keyup', (e) => {
		hideItems();
		if (e.target.value.length >= searchThreshold) {

			var results = fuse.search(e.target.value);

			results.forEach(result => showItem(list[result.refIndex]) );
		}
	})
})()

function addCourseToProspectus(course) {

	console.log(course);
}

let addCourseButtons = document.querySelectorAll('.prospectus-add');

addCourseButtons.forEach(button => {
	let course = button.dataset.course;
	button.addEventListener('click', (e) => {
		console.log(button);
		e.preventDefault();
		addCourseToProspectus(course);
	})
})