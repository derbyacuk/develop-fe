var data = [];
const validParams       = ['subject', 'country', 'category'];
const container         = document.querySelector(".search-page-results-column");
const filterContainer   = document.querySelector(".search-page-filters-column");

var subjectInput        = document.querySelector("select[name='subject']");
var categoryInputs      = document.querySelectorAll("input[name='category']");

let filterCategories    = [];
let filterSubjects      = [];

// Lazy loading/pagination params
let loadedCount = 0;
let perPage     = 20;

let itemWrapper = null;

// Custom Event listener fired from chosen on change.
function subjectInputEventListener() {
    subjectInput.addEventListener('updated', (e) => {
        let options = document.querySelectorAll("#subject option:checked");
        optionsArray = [];

        options.forEach((option) => {optionsArray.push(option.text);});
        localStorage.setItem('subject', JSON.stringify(optionsArray));

        outputData();

    });
}
/**
 * addInputListener - add an event listener for the checkboxes.
 * Run this after they have been built using createFilterForm()
 * @param {HTML Element} input 
 */
function addInputListener(input) {
    let storageKey = input.name;
    let event = {};
    input.addEventListener('click', (e) => {
        //e.preventDefault();
        let value = e.target.value;
        if (e.target.checked) {
            addItemToStorage(storageKey, value);
            event = {
                hitType: 'event',                
                eventCategory: "Derby on Demand Category Change",
                eventAction: 'click',
                eventLabel: value + ' selected'

            }
        } else {
            removeItemFromStorage(storageKey, value);
            event = {
                hitType: 'event',                
                eventCategory: "Derby on Demand Category Change",
                eventAction: 'click',
                eventLabel: value + ' deselected'

            }
        }

        if (typeof(ga) === 'function') {
            ga('gtm3.send', event)
        }

        outputData();
    });
}

/**
 * getData - run an ajax call to the JSON feed
 */
function getData() {

    let key = getStoredItemAsArray('key')[0];

    let httpRequest = new XMLHttpRequest();
    
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                data = JSON.parse(httpRequest.responseText);
                data = data.blocks.block;
                createFilterForm();
                initialiseLocalStorage();
                outputData();
            } else {
                noResults('<p>There was a problem loading the page. Please refresh the page or try again later</p>');
            }
        }
    }
    httpRequest.open('GET', 'https://www.derby.ac.uk/site-assets/feeds/derby-on-demand/feed.json');

    httpRequest.send();
}

/**
 * createFilterForm - create the forms that drive the category and type filters
 */
function createFilterForm() {
    let categoryCounts = {};
    categoryCounts.international = 0;
    categoryCounts.subject = 0;

    for (let item of data) {

        itemCategories = item.category.split('|');

        for (let itemCategory of itemCategories) {

            if (itemCategory) {
                if (filterCategories.indexOf(itemCategory) == -1) {
                    categoryCounts[itemCategory] = 1;
                    filterCategories.push(itemCategory);
                } else {
                    categoryCounts[itemCategory] += 1;
                }
            }
        }


        let itemSubjects = item.subject.split("|");

        for (itemSubject of itemSubjects) {
            if (itemSubject) {
                if (filterSubjects.indexOf(itemSubject) == -1) {
                    filterSubjects.push(itemSubject);
                }
            }
        }

    }
    filterSubjects.sort( (a,b) => {
        return a > b ? 1 : -1;
    });
    
    filterContainer.appendChild(createSubjectForm(filterSubjects));
    filterContainer.appendChild(createCheckboxFilterGroup(filterCategories, "category", categoryCounts));

    subjectInput     = document.querySelector("select[name='subject']");
    categoryInputs   = document.querySelectorAll("input[name='category']");

    subjectInputEventListener();
    
}

/**
 * createSubjectForm - create the form that drives the subject and trigger an
 * event to run chosen on the resulting HTML
 */
function createSubjectForm(items) {
    let subjectGroup = document.createElement("section");
    subjectGroup.classList.add("search-result-filters-group");
    
    let subjectFormGroup = document.createElement("div");
    subjectFormGroup.classList.add("form-group");
    subjectGroup.appendChild(subjectFormGroup);
    
    let label = document.createElement("label");
    label.innerHTML = "Filter by subject";
    label.setAttribute("for", "subject");
    subjectFormGroup.appendChild(label);

    let helpText = document.createElement("p");
    helpText.classList.add("help-block");
    helpText.innerHTML = "Explore additional subjects by using the drop down menu below. Additional subject content will be displayed alongside your original choice.";
    subjectFormGroup.appendChild(helpText);

    let container = document.createElement("div");
    subjectFormGroup.appendChild(container);

    let select = document.createElement("select");
    select.setAttribute("id", "subject");
    select.setAttribute("class", "form-control");
    select.setAttribute("name", "subject");
    select.setAttribute("multiple", "");
    select.setAttribute("data-placeholder", "Select some options");

    container.appendChild(select);

    for (let item of items) {
        let option  = document.createElement("option");
        let optionText = document.createTextNode(item);
        option.appendChild(optionText);
        select.appendChild(option);
    }

    return subjectGroup;
}

function createCheckboxFilterGroup(items, type, count) {

    let subjectGroup = document.createElement("section");
    subjectGroup.classList.add("search-result-filters-group");
    
    let subjectFormGroup = document.createElement("div");
    subjectFormGroup.classList.add("form-group");
    subjectGroup.appendChild(subjectFormGroup);
    
    let fieldset = document.createElement("fieldset");
    fieldset.setAttribute("id", type);
    subjectFormGroup.appendChild(fieldset);
    
    let legend = document.createElement("legend");
    legend.innerHTML = "Filter by " + type;
    fieldset.appendChild(legend);

    let helpText = document.createElement("p");
    helpText.classList.add("help-block");
    helpText.innerHTML = "Refine the content displayed by using the category filters below. Simply select the category that you would like to discover.";
    fieldset.appendChild(helpText);

    let container = document.createElement("div");
    fieldset.appendChild(container);

    for (let item of items) {

        let checkboxOuter = document.createElement("div");
        checkboxOuter.classList.add("checkbox", "checkbox-pretty");
        let checkboxLabel = document.createElement("label");
        checkboxLabel.setAttribute("for", type + "-" + item.toLowerCase().replaceAll(" ", "-"));
        let checkboxText = UCFirst(item);
        if (count.hasOwnProperty(item)) {
            checkboxText += ' (' + count[item] + ')';
        }
        checkboxLabelText = document.createTextNode(checkboxText);
        checkboxOuter.appendChild(checkboxLabel);
        let checkbox = document.createElement("input");
        checkbox.setAttribute("id", type + "-" + item.toLowerCase().replaceAll(" ", "-"));
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", type);
        checkbox.setAttribute("value", item);
        checkboxLabel.appendChild(checkbox);
        addInputListener(checkbox);
        let checkboxSpan = document.createElement("span");
        checkboxLabel.appendChild(checkboxSpan);
        checkboxLabel.appendChild(checkboxLabelText);
        container.append(checkboxOuter);
    }

    return subjectGroup;
}
/**
 * getStoredItemAsArray - given a localStorage key, return an array of
 * items associated with that key
 */
function getStoredItemAsArray(key) {

    if (!key) return [];

    let storedValue = localStorage.getItem(key);
    
    if (!storedValue) return [];
    
    let valuesArray = JSON.parse(storedValue);

    return valuesArray;
}

/**
 * addItemToStorage - given a key and a value, add an item to local storage.
 * This explodes the string, adds new elements, and reconcatenates with the
 * pipe character. Note that item position is not maintained.
 */
function addItemToStorage(key, value, single) {
    single = single || false;

    let values = getStoredItemAsArray(key);
    
    if (values.indexOf(value) !== -1) return;

    if (single) {
        values = [value];
    } else {
        values.push(value);
    }

    localStorage.setItem(key, JSON.stringify(values));

    return true;
}

/**
 * removeItemFromStorage - removes an element from the localStorage item
 * associated with the passed key. The string is exploded, the element
 * removed, and the string reconcatenated with the pipe character
 */
function removeItemFromStorage(key, value) {
    let values = getStoredItemAsArray(key);
    
    if (values.indexOf(value) === -1) return;

    values.splice(values.indexOf(value), 1);

    localStorage.setItem(key, JSON.stringify(values));
}


/**
 * paramsToLocalStorage take URL params and split them, compare them to a
 * list of valid parameters and then store them as key-value pairs in local
 * storage, normalising any data that requires it.
 * 
 */
function paramsToLocalStorage() {
    let paramString = new URLSearchParams(window.location.search);
    for (let key of validParams) {
        if (paramString.has(key)) {
                let single = false;

                if (key == 'country' || key == 'key') {
                    single = true;
                }

                addItemToStorage(key, paramString.get(key), single);
        } else {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, '');
            }
        }
    }
}

function setFormOptions() {
    let subjects = getStoredItemAsArray('subject');
    let categories = getStoredItemAsArray('category');
    let country = getStoredItemAsArray('country')

    for (let categoryInput of categoryInputs) {
        if (categoryInput.value === 'International') {
            if (country[0] !== '' && country[0] !== 'UK') {
                categoryInput.checked = true;
            }
        } else if (categories.indexOf(categoryInput.value) !== -1) {
            categoryInput.checked = true;
        }
    }

    let subjectOptions = document.querySelectorAll("#subject option");

    for (let subjectOption of subjectOptions) {

        if (subjects.indexOf(subjectOption.text) !== -1) {
            subjectOption.setAttribute("selected", "");
        }
    }
}
/**
 * initialiseLocalStorage - set the initial storage options when the page
 * loads.
 */
function initialiseLocalStorage() {
    for (let param of validParams) {
        if (!localStorage.getItem(param)) {
            if (param === 'category') {
                localStorage.setItem('category', JSON.stringify(filterCategories));
            }
        }
    }

    paramsToLocalStorage();
    setFormOptions();
    document.dispatchEvent(new Event('initchosen'));


}

/* filterData - take all the data from the data object and apply any filters
to it as required */
function filterData() {
    let subjects = getStoredItemAsArray('subject');
    let categories = getStoredItemAsArray('category');
    let country = getStoredItemAsArray('country')[0];
    let filteredData = [];

    outerloop:
    for (let item of data) {

        let itemCategory = item.category.split('|')[0];
        let itemSubjects = item.subject.split('|');
        let itemType = item.type;
        let countryList = [
            'UK',
            'United Kingdom',
            'England',
            'Scotland',
            'Wales',
            'Northern Ireland',
        ];

        if ( (countryList.indexOf(country) !== -1) && item.international) {
            continue;
        }

        if (item.weight === 99) {
            filteredData.push(item);
            continue outerloop;
        }

        // Promos ALWAYS get displayed
        // Note - this appears to have changed. Some promos have subjects now
        if (itemType === 'promo') {
    
            if (itemSubjects) {
                for (itemSubject of itemSubjects) {
                    if (itemSubject == "") {
                        filteredData.push(item);
                        continue outerloop;
                    }

                    if ( (itemSubject) && (categories.indexOf('Subject') !== -1)) {
                        if (subjects.indexOf(itemSubject) !== -1) {

                            filteredData.push(item);
                            continue outerloop;
                        }
                    }
                }
            }
        }

        if (itemCategory !== 'Subject') {
            if (categories.indexOf(itemCategory) !== -1) {
                filteredData.push(item);
                continue outerloop;
            }
        }

        for (itemSubject of itemSubjects) {
            if ( (itemSubject) && (categories.indexOf('Subject') !== -1)) {
                if (subjects.indexOf(itemSubject) !== -1) {
                    filteredData.push(item);
                    continue outerloop;
                }
            }
        }

    }

    return filteredData;
}


/* sortData - sort array of items according to a set of rules and return
   the sorted items as an array */
function sortData(items) {

    let filteredItems = items.filter(item => item.weight == 0);
    let weightedItems = items.filter(item => item.weight > 0);

    // Sort all items by date descending
    filteredItems.sort((a, b) => {
        if (a.date > b.date) return -1;

        if (a.date < b.date) return 1;

        return 0;
    });

    // Sort weighted items by their weight number. If they have the same
    // weight, then sort by date. Weighted items are sorted in ascending
    // order, so 999 appears above 1
    weightedItems.sort((a,b) => {
        if (a.weight > b.weight) return 1;
        if (a.weight < b.weight) return -1;

        if (a.weight === b.weight) {
            if (a.date > b.date) return -1;
            if (a.date < b.date) return 1;
        }

        return 0;
    });

    // Stick weighted items on the top.
    if (weightedItems.length) {
        weightedItems.forEach((weightedItem, index) => {
            filteredItems.unshift(weightedItem);
        })
    }

    return filteredItems;
}

/* outputData - filter and sort items and then spit them out into an html
 container */
function outputData() {

    let items = filterData();
    items = sortData(items);

    let containerText = '<section class="search-page-results-grid-section">';
    let category = '';

    container.innerHTML = '';

    // Wrapper class (not for promos) search-page-results-grid-section
    items.forEach((item, index) => {

        if (index === 0) {
            openWrapper('');
            appendToWrapper(item.output);
            closeWrapper();
            return;
        }

        if (item.category !== category) {
            closeWrapper();
            category = item.category;
            container.insertAdjacentHTML('beforeend', '<h2' + ' id="' + item.category.toLowerCase().replaceAll(" ", "-") + '">' + item.category + "</h2>");
            openWrapper(item.category);
        }

        if (item.type == 'promo') {
            closeWrapper();
            container.insertAdjacentHTML('beforeend', item.output);
            openWrapper(item.category);
            return;
        } else {
            appendToWrapper(item.output);
        }

    });

    closeWrapper();

    addTracking();
    document.dispatchEvent(new Event('dod-items-updated'));

}


function openWrapper(category) {
    itemWrapper = null;
    itemWrapper = document.createElement('section');
    itemWrapper.classList.add('search-page-results-grid-section');
    itemWrapper.setAttribute('data-category', category.toLowerCase().replaceAll(" ", "-"));
    return;
}

function appendToWrapper(string) {
    itemWrapper.insertAdjacentHTML('beforeend', string);
}

function closeWrapper() {
    if (itemWrapper) {
        container.appendChild(itemWrapper);
    }
    return;
}
/**
 * UCFirst - uppercase the first letter of a string
 * @param {string} str 
 */
function UCFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/**
 * 
 * @param {*} message 
 */
function addTracking() {
    let targets = document.querySelectorAll(".search-result-wrapper");

    for(let target of targets) {
        target.addEventListener("click", (e) => {
            let category = '';
            let title = target.querySelector(".search-result-heading").innerText;
            let type = target.querySelector(".search-result-tag").innerText.split("•")[0].trim();
            let container = target.closest(".search-page-results-grid-category-wrapper");
            if (container) {
                category = container.getAttribute("data-category");
            }



            let event = {
                hitType: 'event',                
                eventCategory: "Derby on Demand " + " - " + category,
                eventAction: 'click',
                eventLabel: type + ' - ' + title
            }

            if (typeof(ga) === 'function') {
                ga('gtm3.send', event)
            }

        });
    }

}
/**
 * noResults - outputs a message if there is an error.
 * @param {string} message 
 */
function noResults(message) {
    message = message || '';
    let containerText =  '<div class="search-result-wrapper"><section class="search-result"><h2>No results to display</h2>';
    if (message) {
        containerText += message;
    }
    containerText += '</section></div>';
    container.innerHTML = containerText;
}
getData();