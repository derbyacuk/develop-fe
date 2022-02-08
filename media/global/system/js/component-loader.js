/**
 * component-loader.js - takes a component and injects js for the component
 * into the head of the document.
 */
var loadedComponents = [];
var queuedComponents = [];
var queuedStyles = [];

var loadedDependencies = [];
var queuedDependencies = [];

function loadDependencies() {

	// If there aren't any dependencies,
	// we can just load the components.
	if (!queuedDependencies.length) {
		loadComponents();
		return;
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

// We can't just inject things into the head, because it causes chaos
// with ordering. So lets load dependencies first, and then when those
// have loaded, we will run loaded events to see if we can trigger the
// loading of our component javascripts.
(() => {

	const componentsElems = document.querySelectorAll('[data-component]');
	const dependenciesElems = document.querySelectorAll('[data-dependencies]');
	
	// Create arrays which contain all of the stuff that we're going to be loading
	dependenciesElems.forEach( dependencyElem => {

		dependencyArray = dependencyElem.dataset.dependencies.split(',');

		if (dependencyArray.length) {

			dependencyArray.forEach(dependencyItem => {
				if (!queuedDependencies.includes(`/media/global/system/js/dependencies/${dependencyItem}.js`)) {
					queuedDependencies.push(`/media/global/system/js/dependencies/${dependencyItem}.js`);
				}
			})
		}
	});

	componentsElems.forEach( componentElem => {
		const componentName = componentElem.dataset.component;
		const hasJS = componentElem.dataset.hasjs;
		const hasCSS = componentElem.dataset.hascss;

		if (hasJS) {
			if (!queuedComponents.includes(`/media/global/system/js/components/${componentName}/${componentName}.js`)) {
				queuedComponents.push(`/media/global/system/js/components/${componentName}/${componentName}.js`);
			}
		}

		if (hasCSS) {
			if (!queuedStyles.includes(`/media/global/system/css/components/${componentName}/${componentName}.css`)) {
				queuedStyles.push(`/media/global/system/css/dependencies/${componentName}/${componentName}.css`);
			}
		}

		return true;
	})

	loadDependencies();

})()
