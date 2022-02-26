var list = document.querySelectorAll("#search-results > li");
var searchInput = document.getElementById('quick-search-input');
var fuseCheckMaxCount = 5;
var fuseCheckCount = 0;
var resultTemplate = '';

// Set up data for Fuse
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

/**
 * Initialise the prospectus systems.
 */
 (() => {
	searchInput.removeAttribute('disabled');
	hideList();
	var fuse = new Fuse(data, options); // "list" is the item array

	searchInput.addEventListener('keyup', (e) => {
		//hideList();
		hideItems();
		if (e.target.value.length >= searchThreshold) {
			var results = fuse.search(e.target.value);
			results.forEach(result => showItem(list[result.refIndex]) );
			showlist();

		}
	})

	/**
	 * If we have unfocussed the input, and we refocus it
	 * and there is enough text in there, run a search.
	 */
	searchInput.addEventListener('focus', (e) => {
		hideItems();
		if (e.target.value.length >= searchThreshold) {
			var results = fuse.search(e.target.value);

			results.forEach(result => showItem(list[result.refIndex]) );

			showlist();
		}
	})

	if (dataStorage) {
		let selectedCourses = dataStorage.get('courses');

		if (Array.isArray(selectedCourses)) {

			selectedCourses.forEach(course => {
				addCourseToProspectus(course);
			})
		}
	}

	/**
	 * loop through any courses selected in the Query Params
	 * which are parsed and output in the ug-prospectus-header
	 * php file, and add them to the prospectus.
	 */
	preselectedCourses.forEach(course => {

		if (!courseHasBeenSelected(course)) {
			addCourseToProspectus(String(course));
		}
	})
})()

/**
 * Add event listener to the document to allow the user
 * to click off the input/list to close it. Note that using
 * 'blur' on the input does not work
 */
document.addEventListener('click', e => {
	if (!e.target.classList.contains('input-quick-search') && 
		!e.target.classList.contains('quick-search-results-container') &&
		!e.target.classList.contains('prospectus-add')
	) {
		hideList();
	}
})

/**
 * showList - show the Fuse results list. Use for showing/hiding
 * the entire list (e.g. when clicking out of the input)
 * 
 * @return void
 */
function showlist()
{
	document.querySelector('#search-results').style.display = 'block';
}

/**
 * hideList - hide the Fuse results list. Use for showing/hiding
 * the entire list (e.g. when clicking out of the input)
 * 
 * @return void
 */
function hideList()
{
	document.querySelector('#search-results').style.display = 'none';
}

/**
 * showItem - show an item from the list of courses. Used
 * by Fuse when returning results
 * @param {DOM Node} item The item to be shown
 */
 function showItem (item) {
	if (!courseHasBeenSelected(item.dataset.course)) {
		item.classList.remove('hidden');
	}
}

/**
 * hideItems - hide items in the Fuse list. Used by
 * Fuse when returning results. First hide all, then
 * show individual results.
 * 
 * @return void
 */
function hideItems () {
	list.forEach(item => {
		item.classList.add('hidden');
	})
}

// Event listeners for the Fuse results list buttons.
document.querySelectorAll('.prospectus-add').forEach(button => {
	let courseId = button.dataset.course;
	button.addEventListener('click', (e) => {

		e.preventDefault();
		addCourseToProspectus(courseId);
	})
})

/**
 * addCourseToPropsectus
 * @param {int} courseId The sectionId of the course to be removed
 * @return void
 */
function addCourseToProspectus(courseId) {
	let container = document.querySelector('#resultsContainer');
	let result = '';

	courses.forEach(course => {

		if (course.sectionId == courseId) {
			result = buildResult(course);

			if (result) {

				saveResult(course);
				container.insertAdjacentHTML('afterbegin', result);

				document.querySelectorAll('.prospectus-remove').forEach(button => {
					button.removeEventListener('click', removeCourseEvent);
					button.addEventListener('click', removeCourseEvent);
				});

				document.querySelector('.spinner').style.display = "none";
			}
		}
	})

	checkKedleston();
}

/**
 * removeCourseEvent - remove a course from the prospectus. This is to be
 * tied to an event, most notably 'click'.
 * 
 * @param {Object} e Reference to the Event
 */
function removeCourseEvent(e) {
	e.preventDefault();
	let target = e.target.closest('.course-teaser');
	if (target.dataset.hasOwnProperty('course')) {
		unsaveCourse(target.dataset.course);
	}

	if (target.dataset.hasOwnProperty('location')) {
		hideLocation(target.dataset.location);
	}

	target.parentNode.removeChild(target);
	checkKedleston();
}

/**
 * showLocation - change the visibility of location content based
 * on XML feed entry
 * @param {String} targetLocation The location as listed in the XML feed
 * @return {Boolean} true or false
 */
function showLocation(targetLocation = '')
{
	if (!targetLocation) {
		return false;
	}

	if (typeof(locationData) !== 'undefined') {
		if (Array.isArray(locationData)) {

			locationData.forEach(location => {

				if (location.hasOwnProperty('location')) {

					if (location.location == targetLocation) {		

						let locationItems = location.ids;

						locationItems.forEach(item => {

							let elem = document.querySelector(`#${item}`);

							if (elem) {

								elem.style.display = 'block';
							}
						})
					}
				}
			})
		}
	}

	checkKedleston();

	return true;
}

/**
 * hideLocation - remove a location from display.
 * @param {targetLocation} targetLocation String representing the location as in the XML feed
 */
function hideLocation(targetLocation = '')
{
	let elems = document.querySelectorAll(`[data-location="${targetLocation}"]`);

	if (elems.length == 1) {

		locationData.forEach(location => {

			if (targetLocation == location.location) {

				location.ids.forEach(id => {

					let targetElem = document.querySelector('#' + id);
					
					if (targetElem !== null) targetElem.style.display = 'none';
				})
			}
		})
	}

	checkKedleston();

	return true;
}

/**
 * checkKedleston block - toggle the 'There's also' Kedleston Road block
 * if Kedleston Road is not included in the location data. Should be hidden
 * if there are already courses with Kedleston Road as a location.
 */
 function checkKedleston()
 {
	 const kedlestonTitleElement  = document.querySelector('#text-block-152973');
	 const kedlestonVideoElement  = document.querySelector('#content-id-152973');
	 const kedlestonTextElement   = document.querySelector('#text-block-152974');

	 let elems = document.querySelectorAll(`[data-location*="Kedleston"]`);
		 
	 if (elems.length == 0) {
		 kedlestonTitleElement.style.display = 'block';
		 kedlestonTextElement.style.display  = 'block';
		 kedlestonVideoElement.style.display = 'block';
	 } else {
		kedlestonTitleElement.style.display = 'none';
		kedlestonTextElement.style.display = 'none';
		kedlestonVideoElement.style.display = 'none';
	 }
 }
/**
 * buildResult - create the HTML for the selected course
 * @param {Object} course 
 * @returns 
 */
function buildResult(course) {

	let subjectTest = ''
	
	if (course.hasOwnProperty('subject')) {
		subjectTest = course.subject.toLowerCase();
	}

	let location  = course.location;
	
	if (subjectTest.includes('business')) {

		location = 'Business School';

	}

	showLocation(location);

	return `
	<section class="course-teaser" style="max-width: 1000px;" data-course="${course.sectionId}" data-location="${location}">
		<div class="course-teaser-course-level">${course.level} Course</div>
			<div class="course-teaser-heading">
				<div class="h5"><a href="${course.url}">${course.azname}</a></div>
			</div>
			<div class="course-teaser-description">${course.abstract}</div>
			<div class="course-teaser-key-stats">
				<div class="course-teaser-key-stat course-teaser-key-stat-full-width">
					<div class="course-teaser-key-stat-label">Study options:</div>
					<div class="course-teaser-key-stat-content">${course.studyOptions}</div>
				</div>
				${course.ucasCode !== '' ? `<div class="course-teaser-key-stat">
												<div class="course-teaser-key-stat-label">UCAS code:</div>
												<div class="course-teaser-key-stat-content">${course.ucasCode}</div>
											</div>` : ''}
				${course.ucasPoints !== '' ? `<div class="course-teaser-key-stat">
												<div class="course-teaser-key-stat-label">UCAS points:</div>
												<div class="course-teaser-key-stat-content">${course.ucasPoints}</div>
											</div>` : ''}
				${course.entryMonths !== '' ? `<div class="course-teaser-key-stat">
												<div class="course-teaser-key-stat-label">Entry months:</div>
												<div class="course-teaser-key-stat-content">${course.entryMonths}</div>
											</div>` : ''}
			</div>
			<div class="course-teaser-calltoaction">
				<a href="" class="button-v2 invert prospectus-remove" title="Remove ${course.azname} from prospectus list" role="button" tabindex="0" data-scroll>
					<span class="button-text" >Remove from list</span>
				</a>
				<a  href="${course.url}" class="button-v2" role="button" tabindex="0" data-scroll>
					<span class="button-text" title="View ${course.azname} course details">View course</span>
				</a>
			</div>
		</div>
	</section>
	`;
}

/**
 * saveResult - Saves the course sectionId to localstorage. Uses the 
 * dataStorage dependency.
 * 
 * @param {Object} course The course to be stored in localstorage
 * @returns 
 */
function saveResult(course) {
	
	if (!dataStorage) {
		return false;
	}

	// Here we're saving subject interest levels for
	// further personalisation purposes.
	let subjects = dataStorage.get('subjects');
	if (course.hasOwnProperty('subject')) {
		
		if (!subjects.hasOwnProperty(course.subject)) {
			subjects[course.subject] = 1;
		}
	}

	let locations = dataStorage.get('locations');

	if (!Array.isArray('locations')) {
		locations = [];

		locations.push(course.location);
	} else {

		if (!locations.includes(course.location)) {
			locations.push(course.location);
		}
	}

	dataStorage.save('subjects', subjects);

	let courseList = dataStorage.get('courses');
	
	if (!Array.isArray(courseList)) {

		courseList = [];
	}
	
	if (!courseList.includes(course.sectionId)) {

			courseList.push(course.sectionId);
			dataStorage.save('courses', courseList);

			return true;

	} else {

		return false;
	}
}

/**
 * unsaveCourse - given a seciton Id - remove a course from the
 * list in localstorage and resave.
 * 
 * @param {Int} course sectionId of the course
 * @returns 
 */
function unsaveCourse(sectionId) {

	if (!dataStorage) {
		return false;
	}

	let courseList = dataStorage.get('courses');
	
	if (!Array.isArray(courseList)) {

		return false;

	}
	
	let target = courseList.indexOf(sectionId);

	if (target > -1) {
		courseList.splice(target, 1);
		dataStorage.save('courses', courseList);
	}

	return true;
}

/**
 * courseHasBeenSelected - check if a course is already selected and
 * saved in localstorage. Use this to determine whether a course
 * should show up in the search results.
 * 
 * @param {int} sectionId 
 * @returns 
 */
function courseHasBeenSelected(sectionId = 0) {
	let courseList = dataStorage.get('courses');
	
	if (!Array.isArray(courseList)) {

		return false;

	} else {
		
		if ( courseList.includes(String(sectionId)) ) {

			return true;
		}
	}

	return false;
}