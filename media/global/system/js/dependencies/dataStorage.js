/**
 * Generic class for handling user data on the site.
 * This is to be used for personalisation systems and to
 * remember things like user settings and login systems
 * and so forth. DO NOT STORE PID
 */
class DataStorage 
{

	constructor() {

		this.rawData = '';
		this.storedData = {};
		this.nameSpace = 'uod';

		this.getData();
	}

	/**
	 * setNamespace - change the namespace that the 
	 * script uses for referencing stored data. This
	 * alters the 'getItem' call to use whichever
	 * namespage is set here. This shouldn't need to be
	 * changed, but the option is here in case.
	 * @param {String} nameSpace
	 */
	setNamespace(nameSpace) {

		this.nameSpace = nameSpace;
	}

	/**
	 * isLocalStorageAvailable - check if localStorage
	 * is available in the user's browser
	 * 
	 * @return {Boolean}
	 */
	isLocalStorageAvailable() {

    	const test = 'test';

	    try {

	        localStorage.setItem(test, test);
	        localStorage.removeItem(test);

			return true;

	    } catch(e) {

	        return false;
	    }
	}

	/**
	 * 
	 */
	getData() {

		if (!this.isLocalStorageAvailable()) {
			return false;
		}

		this.rawData = localStorage.getItem(this.nameSpace);

		try { 
			this.storedData = JSON.parse(this.rawData);
		
		} catch(e)	{

			this.storedData = {};
		}
	}

	save(key, value) {
		if (!this.storedData) {
			this.storedData = {};
		}
		
		this.storedData[key] = value;
		this.saveDataToLocalStorage();
	}

	saveDataToLocalStorage() {
		localStorage.setItem(this.nameSpace, JSON.stringify(this.storedData));
	}

	get(key) {
		
		if (!this.storedData.hasOwnProperty(key)) {
			return {};
		}

		return this.storedData[key];
	}

	delete(key) {

		this.storedData.delete(key);
		this.saveDataToLocalStorage();
	}

}

var dataStorage = new DataStorage();