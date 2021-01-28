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
 * initialiseLocalStorage
 * setFormOptions
 * gaEvent
 * UCFirst
 */
class DerbyOnDemand {

    constructor() {

        this.ValidParams        = ['subject', 'country', 'category'];
        this.Container          = document.querySelector(".search-page-results-column");
        this.FilterContainer    = document.querySelector(".search-result-filters-collection");
        this.subjectInput       = document.querySelector("select[name='subject']");
        this.categoryInputs     = document.querySelectorAll("input[name='category']");
        this.FeedURL            = 'https://www.derby.ac.uk/site-assets/feeds/derby-on-demand/feed.json';
        this.FeedData           = {};
        this.FilteredData       = [];
        this.Categories         = {};
        this.Subjects           = {};
        this.ItemWrapper        = null;
    }

    /**
     * init - kick off the Derby On Demand process.
     */
    init() {
        const self = this;

        if (this.isIncompatible()) {
            throw new Error('Your browser is not compatible with Derby On Demand');  
        }

        this.getData()
            .then(() =>{
                self.createCategorySubjectData();
                self.createSubjectSelect();
                self.createCategoryCheckboxes();
                self.initialiseLocalStorage();
                self.outputData();
            })
            .catch((error) => {
                self.doError(error.message);
            })
    }

    /**
     * 
     * @param {string} message The message to be displayed to the user
     */
    doError(message) {
        let errorDiv = document.createElement("section");
        errorDiv.classList.add("text-block");
        errorDiv.innerHTML = `<h2>We're sorry</h2><p>${message}</p>`;
        let main = document.querySelector("main");
        main.innerHTML = "";
        document.querySelector("main").appendChild(errorDiv);
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

                        reject({message:'There was a problem fetching Derby on Demand content. Please try again later.'});
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
    createCategorySubjectData() {

        for (const ITEM of this.FeedData) {

            let itemCategories = ITEM.category.split("|");

            for (const CATEGORY of itemCategories) {
                
                if (CATEGORY == '') {continue;}
                
                if (this.Categories.hasOwnProperty(CATEGORY)) {
                    this.Categories[CATEGORY].count ++;
                } else {
                    this.Categories[CATEGORY] = {
                        'title': CATEGORY,
                        'count': 1
                    }
                }
            }

            let itemSubjects = ITEM.subject.split("|");

            for (const SUBJECT of itemSubjects) {

                if (SUBJECT == '') {continue;}

                if (this.Subjects.hasOwnProperty(SUBJECT)) {
                    this.Subjects[SUBJECT].count ++;
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

        return this;
    }
    /* filterData - take all the data from the data object and apply any filters
    to it as required */
    filterData() {
        this.FilteredData = [];
        const filterRules = ['promoRule', 'categoryRule', 'subjectRule'];
        let subjects = this.getStoredItemAsArray('subject');
        let categories = this.getStoredItemAsArray('category');
        let country = this.getStoredItemAsArray('country')[0];``

        outerloop:
        for (let item of this.FeedData) {

            let itemCategory = item.category.split('|')[0];
            let itemSubjects = item.subject.split('|');
            let itemType = item.type;

            if ( (!country) && item.international) {
                continue;
            }

            if (item.weight === 99) {
                this.FilteredData.push(item);
                continue outerloop;
            }

            // Promos ALWAYS get displayed
            // Note - this appears to have changed. Some promos have subjects now
            if (itemType === 'promo') {
        
                if (itemSubjects) {
                    for (const itemSubject of itemSubjects) {
                        if (itemSubject == "") {
                            this.FilteredData.push(item);
                            continue outerloop;
                        }

                        if ( (itemSubject) && (categories.indexOf('Subject') !== -1)) {
                            if (subjects.indexOf(itemSubject) !== -1) {

                                this.FilteredData.push(item);
                                continue outerloop;
                            }
                        }
                    }
                }
            }

            if (itemCategory !== 'Subject') {
                if (categories.indexOf(itemCategory) !== -1) {
                    this.FilteredData.push(item);
                    continue outerloop;
                }
            }

            for (const itemSubject of itemSubjects) {
                if ( (itemSubject) && (categories.indexOf('Subject') !== -1)) {
                    if (subjects.indexOf(itemSubject) !== -1) {
                        this.FilteredData.push(item);
                        continue outerloop;
                    }
                }
            }

        }

        return true;
    }

 

    /* sortData - sort array of items according to a set of rules and return
    the sorted items as an array */
    sortData() {
        const self = this;
        let filteredItems = this.FilteredData.filter(item => item.weight == 0);
        let weightedItems = this.FilteredData.filter(item => item.weight > 0);

        // Sort all items by date descending
        filteredItems.sort((a, b) => {
            if (a.date > b.date) return -1;

            if (a.date < b.date) return 1;

            return 0;
        });
    
        this.FilteredData = filteredItems;

        // Sort weighted items by their weight number. If they have the same
        // weight, then sort by date. Weighted items are sorted in ascending
        // order, so 999 appears above 1
        weightedItems.sort((a,b) => {
            if (a.weight > b.weight) return 1;
            if (a.weight < b.weight) return -1;

            if (a.weight === b.weight) {
                if (a.date > b.date) return 1;
                if (a.date < b.date) return -1;
            }

            return 0;
        });

        // Stick weighted items on the top.
        if (weightedItems.length) {
            weightedItems.forEach((weightedItem, index) => {
                self.FilteredData.unshift(weightedItem);
            })
        }

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

            options.forEach((option) => {optionsArray.push(option.text);});
            localStorage.setItem('subject', JSON.stringify(optionsArray));

            self.outputData();

        });

        container.appendChild(select);

        for (const [KEY, SUBJECT] of Object.entries(this.Subjects)) {
            let option  = document.createElement("option");
            let optionText = document.createTextNode(SUBJECT.title);
            option.appendChild(optionText);
            select.appendChild(option);
        }

        this.FilterContainer.appendChild(subjectGroup);
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
        fieldset.setAttribute("id", 'categoty');
        subjectFormGroup.appendChild(fieldset);
        
        let legend = document.createElement("legend");
        legend.innerHTML = "Filter by " + 'category';
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
            console.log(CATEGORY.title);
            checkbox.setAttribute("id", 'category-' + CATEGORY.title.toString().toLowerCase().replace(/\s/g, "-"));
            checkbox.setAttribute("type", "checkbox");
            checkbox.setAttribute("name", "category");
            checkbox.setAttribute("value", CATEGORY.title);
            
            checkboxLabel.appendChild(checkbox);

            checkbox.addEventListener('click', (e) => {

                //e.preventDefault();

                if (e.target.checked) {

                    self.addItemToStorage('category', CATEGORY.title);

                    self.gaEvent('event', 'Derby on Demand Category Change', 'click', CATEGORY.title + ' selected');

                } else {

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
        this.paramsToLocalStorage();

        for (let param of this.ValidParams) {
            if (!localStorage.getItem(param)) {
                if (param === 'category') {

                    localStorage.setItem('category', JSON.stringify(Object.keys(this.Categories)));
                }
            }
        }

        this.setFormOptions();
        window.history.replaceState(null, null, window.location.pathname);
        document.dispatchEvent(new Event('initchosen'));

        return this;
    }

    /**
     * paramsToLocalStorage take URL params and split them, compare them to a
     * list of valid parameters and then store them as key-value pairs in local
     * storage, normalising any data that requires it.
     * 
     */
    paramsToLocalStorage() {
        let paramString = new URLSearchParams(window.location.search);
        for (let key of this.ValidParams) {
            if (paramString.has(key)) {
                    let single = false;

                    if (key == 'country' || key == 'key') {
                        single = true;
                    }

                    this.addItemToStorage(key, this.UCFirst(paramString.get(key)), single);
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

    this.filterData();
    this.sortData();
    let category = '';

    this.Container.innerHTML = '';

    // Wrapper class (not for promos) search-page-results-grid-section
    this.FilteredData.forEach((item, index) => {

        if (index === 0) {
            this.openWrapper('');
            this.appendToWrapper(item.output);
            this.closeWrapper();
            return;
        }

        if (item.category !== category) {
            this.closeWrapper();
            category = item.category;
            this.Container.insertAdjacentHTML('beforeend', '<h2' + ' id="' + item.category.toLowerCase().replace(/\s/g, "-") + '">' + item.category + "</h2>");
            this.openWrapper(item.category);
        }

        if (item.type == 'promo') {
            this.closeWrapper();
            this.Container.insertAdjacentHTML('beforeend', item.output);
            this.openWrapper(item.category);
            return;
        } else {
            this.appendToWrapper(item.output);
        }

    });

    this.closeWrapper();

    this.addTracking();
    document.dispatchEvent(new Event('dod-items-updated'));

}


openWrapper(category) {
    this.ItemWrapper = null;
    this.ItemWrapper = document.createElement('section');
    this.ItemWrapper.classList.add('search-page-results-grid-section');
    this.ItemWrapper.setAttribute('data-category', category.toLowerCase().replace(/\s/g, "-"));
    return;
}

appendToWrapper(string) {
    this.ItemWrapper.insertAdjacentHTML('beforeend', string);
}

closeWrapper() {
    if (this.ItemWrapper) {
        this.Container.appendChild(this.ItemWrapper);
    }
    return;
}
/**
 * 
 * @param {*} message 
 */
addTracking() {
    const self = this;

    let targets = document.querySelectorAll(".search-result-wrapper");

    for(let target of targets) {
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

        if (typeof(ga) !== 'function') {
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
    DOD.doError(e.message);
}