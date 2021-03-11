
/**
 * Methods:
 * init
 * isIncompatible
 * getData
 * createCategorySubjectData
 * filterData
 * sortData
 * createSubjectSelect
 * createCategoryCheckboxes
 * initialisLocalStorage
 * paramsToLocalStorage
 * getStoredItemsAsArray
 * addItemToStorage
 * removeItemFromStorage
 * setFormOptions
 * gaEvent
 * UCFirst
 */
class DerbyOnDemand {

    constructor() {

        this.Container       = document.querySelector(".search-page-results-column");
        this.FilterContainer = document.querySelector(".search-result-filters-collection");
        this.subjectInput    = document.querySelector("select[name='subject']");
        this.categoryInputs  = document.querySelectorAll("input[name='category']");

        this.FeedURL = 'https://derby.ac.uk/site-assets/feeds/derby-on-demand/feed.json';
        this.Year        = '';
        this.ParamString = '';

        this.ValidParams          = ['subject', 'country', 'category', 'year'];
        this.Years                = [];
        this.FilteredData         = [];
        this.uncategorisedContent = [];

        this.FeedData   = {};
        this.Categories = {};
        this.Subjects   = {};

        this.noSave = false;

        this.ItemWrapper = null;

    }

    /**
     * init - kick off the Derby On Demand process.
     */
    init() {
        const self = this;
        this.ParamString = new URLSearchParams(window.location.search);

        if (this.ParamString.has('nosave')) {
            this.noSave = true;
        }

        if (this.ParamString.has('id')) {
            openVideo = true;
        }
        
        if (localStorage.getItem('testurl') !== null) {
            this.FeedURL = localStorage.getItem('testurl');
        }

        if (this.isIncompatible()) {
            throw new Error('Your browser is not compatible with Derby On Demand');
        }

        let dateCheck = new Date();
        let curYear = dateCheck.getFullYear();

        this.Year = (dateCheck.getMonth() < 8) ? curYear : curYear+1;

        this.getData()
            .then(() => {
                self.createCategorySubjectYearData();
                self.createSubjectSelect();
                self.createCategoryCheckboxes();
                self.createYearButtons();
                self.initialiseLocalStorage();
                self.outputData();
            })
            .catch((error) => {
                self.doError(error);
            });
    }

    /**
     * 
     * @param {string} message The message to be displayed to the user
     */
    doError(e) {
        let errorDiv = document.createElement("section");
        errorDiv.classList.add("text-block");
        errorDiv.innerHTML = `<h2>We're sorry</h2><p>${e.message}</p>`;
        let main = document.querySelector("main");
        main.innerHTML = "";
        document.querySelector("main").appendChild(errorDiv);
        console.log(e);
    }
    /**
     * is_Incompatible add a check in to see if the user's browser is not 
     * an ES6 compatible browser and cannot be used with the dod.js script
     */
    isIncompatible() {
        return (window.navigator.userAgent.match(/MSIE|Trident|Opera Mini/) !== null);
    }

    /**
     * getData run a call to the JSON feed and get all the Derby On Demand data.
     * Returns a promise when the XHL has run. Promise result will contain either
     * a valid feed data object, or an object with an error property
     * 
     * @return {promise} A JavaScript promis object
     */
    getData() {

        let httpRequest = new XMLHttpRequest();

        return new Promise((resolve, reject) => {

            httpRequest.onreadystatechange = () => {

                if (httpRequest.readyState === XMLHttpRequest.DONE) {

                    if (httpRequest.status === 200) {

                        let responseData = JSON.parse(httpRequest.responseText);

                        this.FeedData = responseData.blocks.block;

                        resolve(this.FeedData);

                    } else {

                        reject({ message: 'There was a problem fetching Derby on Demand content. Please try again later.' });
                    }
                }
            }

            httpRequest.open('GET', this.FeedURL);

            httpRequest.send();
        });
    }

    /**
     * createCategoryData - extract category data from the Data
     */
    createCategorySubjectYearData() {

        for (const ITEM of this.FeedData) {

            let years = Object.keys(ITEM.weight);

            years.forEach(year => {
                if (!this.Years.includes(year)) {
                    this.Years.push(year);
                }
            });

            let itemCategories = ITEM.category.split("|");

            for (const CATEGORY of itemCategories) {

                if (CATEGORY == '') { continue; }

                if (this.Categories.hasOwnProperty(CATEGORY)) {
                    this.Categories[CATEGORY].count++;
                } else {
                    this.Categories[CATEGORY] = {
                        'title': CATEGORY,
                        'count': 1
                    }
                }
            }

            let itemSubjects = ITEM.subject.split("|");

            for (const SUBJECT of itemSubjects) {

                if (SUBJECT == '') { continue; }

                if (this.Subjects.hasOwnProperty(SUBJECT)) {
                    this.Subjects[SUBJECT].count++;
                } else {
                    this.Subjects[SUBJECT] = {
                        'title': SUBJECT,
                        'count': 1
                    }
                }
            }
        }


        const sortedCategories = Object.keys(this.Categories).sort().reduce(
            (obj, key) => {
                obj[key] = this.Categories[key];
                return obj;
            },
            {}
        );

        this.Categories = sortedCategories;

        const sortedSubjects = Object.keys(this.Subjects).sort().reduce(
            (obj, key) => {
                obj[key] = this.Subjects[key];
                return obj;
            },
            {}
        );

        this.Subjects = sortedSubjects;
        
        this.Years.sort();
        this.Year = this.Years[0];

        return this;
    }



    addItemToGroup(item) {
        this.FilteredData.push(item)
    }

    /* filterData - take all the data from the data object and apply any filters
    to it as required */
    filterData() {
        const self = this;
        this.FilteredData = [];
        let subjects   = this.getStoredItemAsArray('subject');
        let categories = this.getStoredItemAsArray('category');
        let country    = this.getStoredItemAsArray('country')[0];
        let year       = this.getStoredItemAsArray('year')[0];
        let floatCategory = null;

        if (this.noSave) {
            categories = [];

            var checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
            for (var i = 0; i < checkboxes.length; i++) {
                categories.push(checkboxes[i].value)
            }

            subjects = [];

            var options = document.querySelector('#subject').value;
            subjects.push(options)
        }

        if (typeof (year) !== 'undefined') {
            this.Year = year;
        }

        outerloop:
        for (let item of this.FeedData) {

            if (typeof (item.weight) == undefined) {
                continue outerloop;
            }
            // Filter out items which are not for the current year.
            if (!item.weight.hasOwnProperty(this.Year)) {
                continue outerloop;
            }

            let itemCategory = item.category.split('|')[0];
            item.category = itemCategory;

            let itemSubjects = item.subject.split('|');
            let itemType = item.type;

            if (this.ParamString.has('id')) {
                if (item.section_id == this.ParamString.get('id')) {
                    item.weight[self.Year] += 50;
                    floatCategory = itemCategory;
                }
            }

            if ((!country) && item.international) {
                continue;
            }

            // Promos ALWAYS get displayed
            // Note - this appears to have changed. Some promos have subjects now
            if (itemType === 'promo') {

                if (itemCategory == "") {
                    this.FilteredData.push(item);
                    continue outerloop;
                }

                if (itemSubjects) { 
                    for (const itemSubject of itemSubjects) {

                        if ((itemSubject) && (categories.indexOf('Subject') !== -1)) {
                            if (subjects.indexOf(itemSubject) !== -1) {

                                this.FilteredData.push(item);

                                continue outerloop;
                            }
                        }
                    }
                }
            }

            //this.addUncategorisedItemsToGroups();

            if (itemCategory !== 'Subject') {
                if (categories.indexOf(itemCategory) !== -1) {
                    this.FilteredData.push(item);

                    continue outerloop;
                }
            }

            for (const itemSubject of itemSubjects) {
                if ((itemSubject) && (categories.indexOf('Subject') !== -1)) {
                    if (subjects.indexOf(itemSubject) !== -1) {
                        this.FilteredData.push(item);

                        continue outerloop;
                    }
                }
            }

        }

        if (floatCategory !== null) {

            this.FilteredData.forEach((item) => {
                if (item.category == floatCategory) {
                    item.weight[this.Year] += 100;
                }
            })
        }
        return true;
    }

    /* sortData - sort array of items according to a set of rules and return
    the sorted items as an array */
    sortData() {
        const self = this;

        this.FilteredData.sort((a, b) => {
            if (a.weight[self.Year] == b.weight[self.Year]) {
                let ret = 0;
                if (a.date < b.date) ret = 1;
                if (a.date > b.date) ret = -1;

                return ret;
            }

            if (a.weight[self.Year] < b.weight[self.Year]) return 1;
            if (a.weight[self.Year] > b.weight[self.Year]) return -1;

            return 0;
        });

        return true;
    }

    /**
     * createSubjecSelect - creates a section which contains a form-group which
     * contains a select which contains Subject select items.
     * areas.
     * @return {HTMLCollection} The nodes for the subject select
     */
    createSubjectSelect() {
        const self = this;
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

        select.addEventListener('updated', (e) => {
            let options = document.querySelectorAll("#subject option:checked");
            let optionsArray = [];

            options.forEach((option) => { optionsArray.push(option.text); });
            localStorage.setItem('subject', JSON.stringify(optionsArray));

            self.outputData();
        });

        container.appendChild(select);

        for (const [KEY, SUBJECT] of Object.entries(this.Subjects)) {
            let option = document.createElement("option");
            let optionText = document.createTextNode(SUBJECT.title);
            option.appendChild(optionText);
            select.appendChild(option);
        }

        this.FilterContainer.appendChild(subjectGroup);
        return true;
    }

    /**
     * create Year radio buttons
     */

    createYearButtons() {
        const self = this;

        let storedYear = self.getStoredItemAsArray('year')[0];

        let yearGroup = document.createElement("section");
        yearGroup.classList.add('search-result-filters-group');

        let yearFormGroup = document.createElement('div');
        yearFormGroup.classList.add('form-group');
        yearGroup.appendChild(yearFormGroup);

        let fieldset = document.createElement('fieldset');
        fieldset.setAttribute('id', 'year');
        yearGroup.appendChild(fieldset);

        let legend = document.createElement('legend');
        legend.innerHTML = "Filter by year";
        fieldset.appendChild(legend);

        let helpText = document.createElement("p");
        helpText.classList.add("help-block");
        helpText.innerHTML = "When are you looking to start university?";
        fieldset.appendChild(helpText);

        let container = document.createElement('div');
        fieldset.appendChild(container);

        for (const year of this.Years) {
            let radioOuter = document.createElement("div");
            radioOuter.classList.add("checkbox", "checkbox-pretty");

            let radioLabel = document.createElement("label");
            radioLabel.setAttribute("for", 'year-' + year);

            let radioText = year;

            let radioLabelText = document.createTextNode(radioText);

            radioOuter.appendChild(radioLabel);

            let radio = document.createElement("input");

            radio.setAttribute("id", 'year-' + year);
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", "year");
            radio.setAttribute("value", year);

            radioLabel.appendChild(radio);

            radio.addEventListener('click', (e) => {

                if(this.noSave == true) {
                    this.saveFormSateToStorage();
                    this.noSave = false;
                }

                let selectedYear = document.querySelector('input[name="year"]:checked').value;
                self.addItemToStorage('year', selectedYear, true);
                self.outputData();
            });

            let radioSpan = document.createElement("span");

            radioLabel.appendChild(radioSpan);
            radioLabel.appendChild(radioLabelText);

            container.append(radioOuter);
        }

        this.FilterContainer.appendChild(yearGroup);

        return true;
    }

    /**
     * createCategoryCheckboxes - creates the HTML for the category selection
     * list.
     */
    createCategoryCheckboxes() {

        const self = this;

        let subjectGroup = document.createElement("section");
        subjectGroup.classList.add("search-result-filters-group");

        let subjectFormGroup = document.createElement("div");
        subjectFormGroup.classList.add("form-group");
        subjectGroup.appendChild(subjectFormGroup);

        let fieldset = document.createElement("fieldset");
        fieldset.setAttribute("id", 'category');
        subjectFormGroup.appendChild(fieldset);

        let legend = document.createElement("legend");
        legend.innerHTML = "Filter by category";
        fieldset.appendChild(legend);

        let helpText = document.createElement("p");
        helpText.classList.add("help-block");
        helpText.innerHTML = "Refine the content displayed by using the category filters below. Simply select the category that you would like to discover.";
        fieldset.appendChild(helpText);

        let container = document.createElement("div");
        fieldset.appendChild(container);

        for (const [INDEX, CATEGORY] of Object.entries(this.Categories)) {
            let checkboxOuter = document.createElement("div");
            checkboxOuter.classList.add("checkbox", "checkbox-pretty");

            let checkboxLabel = document.createElement("label");
            checkboxLabel.setAttribute("for", 'category-' + CATEGORY.title.toLowerCase().replace(/\s/g, "-"));

            let checkboxText = this.UCFirst(CATEGORY.title);

            if (CATEGORY.hasOwnProperty(CATEGORY.count)) {
                checkboxText += ' (' + CATEGORY.count + ')';
            }

            let checkboxLabelText = document.createTextNode(checkboxText);

            checkboxOuter.appendChild(checkboxLabel);

            let checkbox = document.createElement("input");

            checkbox.setAttribute("id", 'category-' + CATEGORY.title.toString().toLowerCase().replace(/\s/g, "-"));
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("name", "category");
            checkbox.setAttribute("value", CATEGORY.title);

            checkboxLabel.appendChild(checkbox);

            checkbox.addEventListener('click', (e) => {

                //e.preventDefault();

                if (e.target.checked) {

                    if (this.noSave == true) {
                        this.saveFormSateToStorage();
                        this.noSave = false;
                    }

                    self.addItemToStorage('category', CATEGORY.title);

                    self.gaEvent('event', 'Derby on Demand Category Change', 'click', CATEGORY.title + ' selected');

                } else {

                    if (this.noSave == true) {
                        this.saveFormSateToStorage();
                        this.noSave = false;
                    }

                    self.removeItemFromStorage('category', CATEGORY.title);

                    self.gaEvent('event', 'Derby on Demand Category Change', 'click', CATEGORY.title + ' deselected');
                }

                self.outputData();
            });

            let checkboxSpan = document.createElement("span");

            checkboxLabel.appendChild(checkboxSpan);
            checkboxLabel.appendChild(checkboxLabelText);

            container.append(checkboxOuter);
        }

        this.FilterContainer.appendChild(subjectGroup);

        return true;
    }

    /**
     * initialiseLocalStorage - set the initial storage options when the page
     * loads.
     */
    initialiseLocalStorage() {

        if (!this.noSave == true) {
            this.paramsToLocalStorage();

            for (let param of this.ValidParams) {
                if (!localStorage.getItem(param)) {
                    if (param === 'category') {

                        localStorage.setItem('category', JSON.stringify(Object.keys(this.Categories)));
                        this.addItemToStorage('category', 'Welcome');
                    }

                    if (param === 'year') {
                        localStorage.setItem('year', JSON.stringify([this.Year]));
                    }
                }
            }
        }

        this.setFormOptions();
        window.history.replaceState(null, null, window.location.pathname);
        document.dispatchEvent(new Event('initchosen'));

        return this;
    }

    saveFormSateToStorage() {
        this.saveCategoryFormSateToStorage();
        this.saveYearFormSateToStorage();
        this.saveSubjectFormSateToStorage();
    }

    saveCategoryFormSateToStorage() {
        localStorage.setItem('category', JSON.stringify([]));
        let categoryCheckboxes = document.querySelectorAll('[name="category"]:checked');
        categoryCheckboxes.forEach((checkbox) => {
            this.addItemToStorage('category', checkbox.value);
        })
    }

    saveYearFormSateToStorage() {
        localStorage.setItem('year', JSON.stringify([]));

        let yearCheckbox = document.querySelector('[name="year"]:checked').value;

        this.addItemToStorage('year', yearCheckbox);
    }

    saveSubjectFormSateToStorage() {
        localStorage.setItem('subject', JSON.stringify([]));

        let subjectSelects = document.querySelector("#subject").selectedOptions;

        for(const subject of subjectSelects) {
            this.addItemToStorage('subject', subject.value);
        }
    }
    /**
     * paramsToLocalStorage take URL params and split them, compare them to a
     * list of valid parameters and then store them as key-value pairs in local
     * storage, normalising any data that requires it.
     * 
     */
    paramsToLocalStorage() {

        for (let key of this.ValidParams) {
            if (this.ParamString.has(key)) {
                let single = false;

                if (key == 'country' || key == 'key' || key == 'year') {
                    single = true;
                }

                    this.addItemToStorage(key, this.UCFirst(this.ParamString.get(key)), single);

                    if (key == 'year') {
                        if (!this.Years.includes(this.ParamString.get(key))) {
                            this.addItemToStorage('year', this.Years[this.Years.length - 1], true);
                        }
                    }

            } else {
                if (!localStorage.getItem(key)) {
                    localStorage.setItem(key, '');
                }
            }
        }
    }

    /**
     * getStoredItemsAsArray - return items stored in the user's localStorage
     * and JSON parse them. Always returns an array of items.
     * 
     * @param {string} key The key of the item stored in localStorage
     * @return {array} An array of items stored at the key location in localStorage
     */
    getStoredItemAsArray(key) {

        if (!key) return [];

        let storedValue = localStorage.getItem(key);

        if (!storedValue) return [];

        let valuesArray = JSON.parse(storedValue);

        return valuesArray;
    }

    /**
     * addItemToStorage - stores an item or items in the user's localstorage.
     * If the item already exists in the stored array, this will return false, 
     * so duplicate itens cannot be stored. Additionally, an item can be marked
     * as 'single' which means that this value will overwrite what is already in
     * storage, rather than adding it to the stack.
     * 
     * @param {string} key The key to store the item(s) under
     * @param {string} value The value to be stored
     * @param {boolean} single If this is a single item only key
     */
    addItemToStorage(key, value, single) {
        single = single || false;

        let values = this.getStoredItemAsArray(key);

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
     * removeItemFromLocalStorage - given a key and a value, will JSON parse the
     * data held in localStorage at the specified key, remove the item matching
     * the passed values, then JSON encode and resave the item.
     * 
     * @param {string} key The key to remove the value from
     * @param {string} value The value to be removed
     */
    removeItemFromStorage(key, value) {
        let values = this.getStoredItemAsArray(key);

        if (values.indexOf(value) === -1) return;

        values.splice(values.indexOf(value), 1);

        localStorage.setItem(key, JSON.stringify(values));
    }

    /**
     * setFormOptions - get data from local storage and use to initialise form
     * options when the page loads.
     */
    setFormOptions() {

        let categoryInputs = document.querySelectorAll("input[name='category']");
        let subjects = this.getStoredItemAsArray('subject');
        let categories = this.getStoredItemAsArray('category');

        if (this.noSave == true) {
            if (this.ParamString.has('category')) {
                categories = [this.ParamString.get('category')];
            } else {
                categories = Object.keys(this.Categories);
            };

            if (this.ParamString.has('subject')) {
                subjects = [this.ParamString.get('subject')];
            } else {
                subjects = '';
            }

        }

        let year = this.getStoredItemAsArray('year')[0];

        if (!year) {
            year = this.Year;
        }

        if (document.querySelector(`input[name="year"][value="${year}"]`)) {
            document.querySelector(`input[name="year"][value="${year}"]`).checked = true;
        }

        for (let categoryInput of categoryInputs) {
            if (categories.indexOf(categoryInput.value) !== -1) {
                categoryInput.checked = true;
            }
        }

        let subjectOptions = document.querySelectorAll("#subject option");

        for (let subjectOption of subjectOptions) {

            if (subjects.indexOf(subjectOption.text) !== -1) {
                subjectOption.setAttribute("selected", "");
            }
        }

        return this;
    }


    /* outputData - filter and sort items and then spit them out into an html
    container */
    outputData() {
        const self = this;
        this.filterData();
        this.sortData();
        let previousCategory = '';
        let itemContainer = document.createElement('div');        
        this.Container.innerHTML = '';

        this.FilteredData.forEach((item, index) => {

            if (item.category !== previousCategory) {

                previousCategory = item.category;

                if (itemContainer !== '') {
                    self.Container.appendChild(itemContainer);
                }

                let categoryId = item.category.toLowerCase().replace(/\s/g, "-");

                let header = document.createElement("h2");
                header.setAttribute('id', categoryId);
                header.innerText = item.category;
                self.Container.appendChild(header);

                
                itemContainer = document.createElement('div');
                itemContainer.classList.add('search-page-results-grid-section');
                itemContainer.dataset.category = categoryId;
            }
            
    
            let tmpContainer = document.createElement('div');
            tmpContainer.innerHTML = item.output;
            tmpContainer.querySelector('section').dataset.weight = item.weight[this.Year];
            tmpContainer.querySelector('section').dataset.id = item.section_id;

            if (this.ParamString.has('id')) {

                if (item.section_id == this.ParamString.get('id')) {

                    tmpContainer.querySelector('.search-result-wrapper').classList.add('search-result-wrapper-fullbleed');
                    let spacer = document.createElement('div');
                    tmpContainer.appendChild(spacer);
                }
            }

            itemContainer.innerHTML += tmpContainer.innerHTML;


                self.Container.appendChild(itemContainer);
        })

        this.addTracking();

        document.dispatchEvent(new Event('dod-items-updated'));
    }

    /**
     * 
     * @param {*} message 
     */
    addTracking() {
        const self = this;

        let targets = document.querySelectorAll(".search-result-wrapper");

        for (let target of targets) {
            target.addEventListener("click", (e) => {
                let category = '';
                let title = target.querySelector(".search-result-heading").innerText;
                let type = target.querySelector(".search-result-tag").innerText.split("•")[0].trim();
                let container = target.closest(".search-page-results-grid-section");
                if (container) {
                    category = container.getAttribute("data-category");
                }

                let eventCategory = "Derby on Demand " + " - " + category,
                    eventLabel = type + ' - ' + title;

                self.gaEvent('event', eventCategory, 'click', eventLabel);

            });
        }
    }
    
    /**
     * 
     * @param {string} type The type of event (usually 'event')
     * @param {string} category The event category (e.g. 'Derby On Demand category change')
     * @param {string} action The event action (e.g. 'click')
     * @param {string} label The event label (e.g. 'Facilities selected')
     */
    gaEvent(type, category, action, label) {

        if (typeof (ga) !== 'function') {
            return false;
        }

        type = type || 'event';
        category = category || '';
        action = action || '';
        label = label || '';

        let event = {
            hitType: type,
            eventCategory: category,
            eventAction: action,
            eventLabel: label
        };
        ga('create', 'UA-2533225-1', 'auto', 'genericTracker');
        ga('genericTracker.send', event);

        return true;
    }

    /* UTILITY FUNCTIONS */
    BubbleSort = (input) => {

        let length = input.length - 1;

        for (let i = 0; i < length; i++) {

            for (let j = 0; j < length; j++) {

                if (input[j].weight < input[j + 1].weight) {

                    let tmp = input[j];
                    input[j] = input[j + 1];
                    input[j + 1] = tmp;
                }
            }
        }

        return input;
    }
    /**
     * UCFirst - uppercase the first letter of a string
     * @param {string} str The string to be transformed
     * @return {string} The transformed string
     */
    UCFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * inArray - takes two arrays and checks whether any of the items in
     * the first array exist in the second array.
     * 
     * @param {array} arr1 First array to compare from
     * @param {array} arr2 Second array to compare to
     * @return {boolean} true if the elements exsits in the second array or false
     */
    inArray(arr1, arr2) {
        return !!arr1.filter(element => arr2.includes(element)).length
    }
}

const DOD = new DerbyOnDemand();

try {
    DOD.init();

} catch (e) {
    DOD.doError(e);
}