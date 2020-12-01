/**
 * moduleComponent - class for populating and adding interaction to the module component
 */
function ModuleComponent() {

	if (!moduleData) throw new Error("No Module Data provided");

	this.tabsContainer = document.getElementById('tabsContainer');
	this.moduleSelectionMenu = document.getElementById('moduleSelectionMenu');
	this.moduleContainer = document.getElementById('moduleContainer');
    this.moduleColumn = document.getElementById("moduleColumn");
    this.lastPosition = 0;
	let self = this;

    window.addEventListener("orientationchange", function(){
        self.unloadModule();
    });
    
    /**
     *  Call init first. This creates the initial module display.
     */
    this.init = function() {
        this.createCourseModules(moduleData.pathways[0].title);
    }

	/**
	 * createCourseModules - given an ID build the HTML for a course
	 * pathway
	 */
	this.createCourseModules = function (pathwayID) {
		pathWayID = pathwayID || "";
		var self = this;
		this.tabsContainer.innerHTML = "";

		moduleData.pathways.forEach(function (pathway) {
			if (pathway.title == pathwayID) {
				let isActive = true;
				pathway.stages.forEach(function (stage) {
					self.createTab(stage, isActive);
					
					if (isActive) {
						self.createMenu(stage)
					};

					isActive = false;
				});
			}
		});
	}

	/**
	 * createTab - creat the HTML for a tab and append it to the
	 * tabs node
	 * 
	 * @param {object} stage The module stage to create tabs for
	 */
	this.createTab = function (stage, isActive) {
		let button = document.createElement('a');
		button.setAttribute("class", "tab button-large button-blue");
		button.setAttribute("role", "button");
		if (isActive) {this.makeActive(button)};
		button.textContent = stage.title;
		let overlay = document.createElement('span')
		overlay.setAttribute("class", "button-overlay");
		let innerOverlay = document.createElement('span')
		innerOverlay.textContent = stage.title;
		overlay.appendChild(innerOverlay);
		button.appendChild(overlay);
		button.addEventListener("click", function (e) {
			self.createMenu(stage);
            self.makeActive(this);
		});

		if (this.hasModules(stage)) {
			this.tabsContainer.appendChild(button);
		}
	}

	/**
	 * hasModules - Check if a stage has any modules. Used for
	 * skipping tabs that are empty.
	 */
	this.hasModules = function(stage) {
		for( var categoryItr = 0; categoryItr < stage.categories.length; categoryItr ++) {
			if (!stage.categories[categoryItr].modules.length) {
				return false;
			} else {

				if (this.categoryHasModules(stage.categories[categoryItr])) {
					return true;
				}
			}

		}

		return false;
	}

	/**
	 * categoryHasModules - Check if a specific category has any modules. Used for
	 * skipping menus that are empty and to drive hasModules.
	 */
	this.categoryHasModules = function(category) {

		for (var i = 0; i < category.modules.length; i++) {
			var moduleCode = category.modules[i];
			var module = {};
			module = moduleData.modules[moduleCode];
			if (!module) {
				continue;
			} else if (module.hasOwnProperty("code")) {
				return true;
			}
		}

		return false;
	}

	/**
	 * createMenu - generate the HTML for the module component module selection menu
	 */
	this.createMenu = function (stage) {
		this.moduleSelectionMenu.innerHTML = "";
	
		for( var categoryItr = 0; categoryItr < stage.categories.length; categoryItr ++) {
			let category = stage.categories[categoryItr];
			let modules = category.modules;
			if (modules.length) {
				if (this.categoryHasModules(category)) {
					let subTitle = document.createElement("div");
					subTitle.setAttribute("class", "h3 module-list-menu-heading");
					subTitle.textContent = category.title + " modules";
					this.moduleSelectionMenu.appendChild(subTitle);
					
					for (var moduleItr = 0; moduleItr < modules.length; moduleItr++) {

						let moduleID = modules[moduleItr];
						let module = moduleData.modules[moduleID];
						let menuIsActive = false;

						if (categoryItr == 0 && moduleItr == 0 && !isMobileLayout()) {
							menuIsActive = true;
							self.loadModule(module, category.title);
						}

						let moduleNode = this.createMenuItem(moduleID, module, category.title, menuIsActive);

						if (moduleNode) {
							this.moduleSelectionMenu.appendChild(moduleNode);
						}
					}
				}

			}
			
		}
	}

	this.createMenuItem = function(moduleID, module, status, isActive) {
        if (!module) {return false;}
		let menuItem = document.createElement("a");
		menuItem.setAttribute("class","module-list-menu-item");
		menuItem.setAttribute("href", "");
		if (isActive) this.makeActive(menuItem);
		menuItem.setAttribute("data-code", moduleID);
		let menuDetailWrapper = document.createElement("div");
		menuDetailWrapper.setAttribute("class", "module-list-menu-item-details");
		let menuDetailLabel = document.createElement("div");
		menuDetailLabel.setAttribute("class", "module-list-menu-item-details-label");
		menuDetailLabel.textContent = module.title;
		menuDetailWrapper.appendChild(menuDetailLabel);
		let menuDetailArrowWrapper = document.createElement("div");
		menuDetailArrowWrapper.setAttribute("class","module-list-menu-item-details-arrow");
		let menuDetailArrow = document.createElement("i");
		menuDetailArrow.setAttribute("class", "uod-icons uod-icons-up-arrow");
		menuDetailArrowWrapper.appendChild(menuDetailArrow);
		menuDetailWrapper.appendChild(menuDetailArrowWrapper);
		menuItem.appendChild(menuDetailWrapper);
		menuItem.addEventListener("click", function (e){
			e.preventDefault();
			e.stopPropagation();
            self.lastPosition = window.scrollY;
			self.loadModule(module, status);
			self.makeActive(this);
            if (isMobileLayout()) {
                document.body.classList.add("modal-open");
 			}
		});

		return menuItem;
	}

	this.makeActive = function (target) {
		let elems = document.getElementsByClassName(target.classList[0]);
		[].forEach.call(elems, function(el){el.classList.remove("active")});
		target.classList.add("active");
	}

	this.loadModule = function (module, status) {
        if (!module) { return false; }
		this.unloadModule();
		document.getElementById("module-code").innerHTML = "Code: " + module.code;
		document.getElementById("module-title").innerHTML = module.title;
		document.getElementById("module-introduction").innerHTML = module.introduction;
		document.getElementById("module-details").innerHTML = module.details;
		document.getElementById("module-credits").innerHTML = module.credits + " Credits";
        
        let backLink = document.getElementById("backLink");

        backLink.addEventListener("click", function(event) {

            event.preventDefault();
            event.stopPropagation();

            document.getElementById("moduleColumn").classList.remove("active");
            document.getElementById("")
            document.getElementById("moduleContainer").classList.remove("active");
            document.body.classList.remove("modal-open");
            window.scrollTo(0, self.lastPosition);
        });

        if (module.details) {
            let buttonContainer = document.getElementById("tagsFirstRow");
            let button = document.createElement("a");
            button.setAttribute("href", "#");
            button.classList.add("module-expand");
            button.setAttribute("id", "more-information-button");
            button.innerText = "More information";
            button.setAttribute("title", "More information about " + module.title);

            button.addEventListener("click", function(event) {
                event.preventDefault();
                event.stopPropagation();

                targetElem = document.getElementsByClassName("module-list-module-details-full")[0];
                targetElem.classList.toggle("active");
                this.innerHTML = targetElem.classList.contains("active") ? "Less information" : "More information";

            });

            buttonContainer.appendChild(button);
        }

		let baseTag = "module-list-module-details-tag-";
		let addTag = baseTag + status.toLowerCase();
		let removeTag = status === "core" ? baseTag + "optional" : baseTag + "core";
		
		let statusNode = document.getElementById("module-status");
		statusNode.classList.remove(removeTag);
		statusNode.classList.add(addTag);
		statusNode.innerHTML = status;
        let tabContainer = document.getElementById("assessmentTags");
        for (var i = 0; i < module.assessment.length; i++) {
            let assessment = module.assessment[i];
            let assessmentTag = document.createElement("div");
            assessmentTag.classList.add("module-list-module-details-tag");
            assessmentTag.classList.add("module-list-module-details-tag-type");
            assessmentTag.innerText = assessment;
            tabContainer.appendChild(assessmentTag);
            
        }
        void this.moduleContainer.offsetWidth;
        this.moduleContainer.classList.add("active");
        this.moduleColumn.classList.add("active");
	}

	this.unloadModule = function () {
        void this.moduleContainer.offsetWidth;
        this.moduleContainer.classList.remove("active");
        this.moduleColumn.classList.remove("active");
        document.body.classList.remove("modal-open");
		document.getElementById("module-code").innerHTML = "";
		document.getElementById("module-title").innerHTML = "";
		document.getElementById("module-introduction").innerHTML = "";
		document.getElementById("module-details").innerHTML = "";
		document.getElementById("module-credits").innerHTML = "";
        document.getElementById("assessmentTags").innerHTML = "";
        let target = document.getElementById("more-information-button");
        if (target) {
            target.parentElement.removeChild(target);
        }
	}
}

/*******************************************************************************
 *
 * MODULE UTILITY FUNCTIONS
 *
 ******************************************************************************/

/**
 * use the is-mobile-layout div size to determine if the mobile
 * media query is currently active. This resolves to either 1 or 0 so
 * is a truthy/falsy value
 *
 * @return int the offset height of the is-mobile-layout div.
 */
function isMobileLayout() {
	return document.getElementById("is-mobile-layout").offsetHeight;
}

/**
 * isIOS - determine if the user is using an IOS device so we know to
 * resize the full-screen modal when the window furniture changes
 * position.
 *
 * @return {Boolean} True if IOS or false if not.
 */
function isIOS() {
	var ua = window.navigator.userAgent;
	var iOS = !!ua.match(/iPhone/i);
	var webkit = !!ua.match(/WebKit/i);
	return iOS && webkit && !ua.match(/CriOS/i);
}
/**************************************/
// Initialise the module component
// and create the pathway select input
/**************************************/
var moduleComponent = new ModuleComponent(moduleData);
moduleComponent.init();

if (moduleData.pathways.length > 1) {
    // Optional - used to trigger pathway functionality. Can be any trigger that
    // fires createCourseModules Used here as an example of how we could create
    // this dynamically from the module data

    let pathwayContainer = document.createElement("div");
        pathwayContainer.classList.add("text-block", "run-on");

    let pathwayText = document.createElement("p");
        pathwayText.innerText = 'This course enables you to select a pathway so that your degree is tailored specifically for you. Each pathway allows you to gain specific skills depending on your personal interests and career aspirations and will determine the focus of your course and the modules that you will take. Please choose a pathway by selecting one from the drop-down below:';

        pathwayContainer.appendChild(pathwayText);

    let pathwayLabel = document.createElement("label");
        pathwayLabel.classList.add("aria-label", "search-input-label");
        pathwayLabel.setAttribute("for", "pathway-select");
        pathwayLabel.innerText = "Choose a pathway";

        pathwayContainer.appendChild(pathwayLabel);
    
    let pathwaySelect = document.createElement("select");
        pathwaySelect.classList.add("form-control");
        pathwaySelect.setAttribute("id", "pathway-select");
        pathwaySelect.setAttribute("name", "pathway-select");

        pathwayContainer.appendChild(pathwaySelect);

    moduleData.pathways.forEach(function(elem, index) {

        let option = document.createElement("option");

        if (index == 0) {
            option.setAttribute("selected", "true");
        }

        option.innerText = elem.title;
        pathwaySelect.appendChild(option);
    });

    pathwaySelect.addEventListener("change", function() {
        moduleComponent.createCourseModules(this.value);
    });

    document.getElementById("module-intro").insertAdjacentElement("afterend", pathwayContainer);
}