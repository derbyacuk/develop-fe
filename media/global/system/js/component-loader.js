/**
 * component-loader.js - takes a component and injects js for the component
 * into the head of the document.
 */
 var loadedComponents = [];
 var queuedComponents = [];
 
 var queuedStyles = [];
 var loadedStyles = [];
 
 var loadedDependencies = [];
 var queuedDependencies = [];
 
 function loadDependencies() {
	 if (!queuedDependencies.length) {
		 loadComponents();
	 }
	 // First of all, load all of our dependencies...
	 queuedDependencies.forEach(dependency => {
		 let scriptElem = document.createElement('script');
		 scriptElem.setAttribute('src', dependency);
		 scriptElem.addEventListener('load', () => {
			 console.log(`${dependency} is loaded...`);
			 
			 loadedDependencies.push(dependency);
			 
			 if (loadedDependencies.length == queuedDependencies.length) {
				 loadComponents();
			 }
		 })
		 document.body.appendChild(scriptElem);
	 })
 }
 
 function loadComponents() {
	 // First of all, load all of our dependencies...
	 queuedComponents.forEach(component => {
		 let scriptElem = document.createElement('script');
		 scriptElem.setAttribute('src', component);
		 scriptElem.addEventListener('load', () => {
			 console.log(`${component} is loaded...`);
			 loadedComponents.push(component);
			 
		 })
 
		 document.body.appendChild(scriptElem);
	 })
 
 }
 
 function loadStyles() {
	 console.log('Loading styles');
	 // First of all, load all of our dependencies...
	 queuedStyles.forEach(component => {
		 let styleElem = document.createElement('link');
		 styleElem.setAttribute('href', component + '?cb=' + new Date().getTime());
		 styleElem.setAttribute('rel', 'stylesheet');
		 styleElem.setAttribute('medial', 'all');
		 styleElem.addEventListener('load', () => {
			 console.log(`${component} is loaded...`);
			 loadedStyles.push(component);
			 
		 })
 
		 document.body.appendChild(styleElem);
	 })
 
 }
 
 // We can't just inject things into the head, because it causes chaos
 // with ordering. So lets load dependencies first, and then when those
 // have loaded, we will run loaded events to see if we can trigger the
 // loading of our component javascripts.
 (() => {
 
	 const components = document.querySelectorAll('[data-component]');
 
	 // Create arrays which contain all of the stuff that we're going to be loading
	 components.forEach( component => {
		 // Oh my God, JavaScript. You DO NOT scope constants. 
		 // Literally that is the ENTIRE point of constants
		 // That they are constant. Hence the name.
		 var dependencies = '';	 
 
		 if (!component.dataset.hasOwnProperty('component')) {
			 return false;
		 }
 
		 const componentName = component.dataset.component;
		 
		 if (component.dataset.hasOwnProperty('dependencies')) {
			 dependencies = component.dataset.dependencies.split(',');
		 }
 
		 const hasJS = component.dataset.hasjs;
		 const hasCSS = component.dataset.hascss;
 
		 if (dependencies.length) {
 
			 dependencies.forEach(dependency => {
				 if (!queuedDependencies.includes(`/media/global/system/js/dependencies/${dependency}.js`)) {
					 queuedDependencies.push(`/media/global/system/js/dependencies/${dependency}.js`);
				 }
			 })
		 }
 
		 if (hasJS) {
			 if (!queuedComponents.includes(`/media/global/system/js/components/${componentName}.js`)) {
				 queuedComponents.push(`/media/global/system/js/components/${componentName}.js`);
			 }
		 }
 
		 if (hasCSS) {
			 if (!queuedStyles.includes(`/media/global/system/css/components/${componentName}.css`)) {
				 queuedStyles.push(`/media/global/system/css/components/${componentName}.css`);
			 }
		 }
 
		 return true;
	 })
	 loadStyles();
	 loadDependencies();
 
 })()
 