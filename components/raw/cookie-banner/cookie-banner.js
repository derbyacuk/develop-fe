var consentCookieName = "cookie-consent";
var dataLayerKey = "OptanonActiveGroups";
var expiry = 1825;
var acceptAllButton = document.querySelectorAll(".banner-content .button-large")[0];
var saveAndCloseButton = document.querySelectorAll(".banner-content .button-large")[1];
var openCookiesDialog = document.querySelectorAll(".footer-submenu-three .footer-link")[4]; // This needs to be replaced on live with an ID

/**
 * self-invoking function to boot all of our initial states, etc.
 * Some of this stuff doesn't need to be here, but I've put it in here
 * to keep it tidy. Effectively this is our "main" function.
 *
 * @return {object} Self reference for object chaining
 */
(function(){
	if (document.querySelectorAll(".cookie-overlay").length) {
		let cookies = getCookie(consentCookieName);

		acceptAllButton.addEventListener("click", function(e){
			e.preventDefault();
			e.stopPropagation();

			setAllCookies();

			location.reload();
		});

		saveAndCloseButton.addEventListener("click", function(e){
			e.preventDefault();
			e.stopPropagation();

			setSelectedCookies();

			location.reload();
		});

		openCookiesDialog.addEventListener("click", function(e) {
			e.preventDefault();
			e.stopPropagation();

			showBanner();
		});

		if (cookies) {
			checkBoxesFromCookie();

			hideBanner();

			setDataLayerValue(dataLayerKey, cookies);

		} else {

			showBanner();
		}
	}

	return this;
})()

/**
 * deleteCookies - delete all cookies from the users machine. Copypasta from
 * stackoverflow
 * @return {object} Self reference for chaining
 */
function deleteCookies() {

    var cookies = document.cookie.split("; ");
    for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
            var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            var p = location.pathname.split('/');
            document.cookie = cookieBase + '/';
            while (p.length > 0) {
                document.cookie = cookieBase + p.join('/');
                p.pop();
            };
            d.shift();
        }
    }

    return this;
}

/**
 * setCookie sets a cookie on the user's machine. Note that cookie
 * values must be a string.
 * @param {string} key    The name of the cookie to set
 * @param {string} value  The value contained within the cookie
 * @param {string} expiry The cookie lifetime in days
 */
function setCookie(name, value, expiry) {
	expiry = expiry || 0;
	let expiryDate = new Date();
	expiryDate.setTime(expiryDate.getTime() + (expiry*24*60*60*1000));
	let expires = "expires="+ expiryDate.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * getCookie return the current value of a cookie set on the
 * user's machine by the cookie name. Will return an empty string
 * if the cookie does not exist.
 * @param  {string} key The name of the cookie to be retrieved
 * @return {string}     The value of the cookie
 */
function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");

 	if (parts.length == 2) return parts.pop().split(";").shift();

 	return "";
}

/**
 * setDataLayerValue inserts a key/value pair into the GTM DataLayer
 * this is used for determining which GTM tags should fire. This should
 * be in the same structure that's used by OneTrust to ensure compatability
 * (selected cookie types are a comma separated list of integers). Note that
 * dataLayer can only accept strings as values
 * @param {string} key   The key of the hash value to be set
 * @param {string} value The hash value
 */
function setDataLayerValue(key, value) {
	window.dataLayer = window.dataLayer || [];

	window.dataLayer.push({key: value});

}

/**
 * setAllCookies sets all available cookie options to 'on', this should
 * be used when the "Accept all Cookies" button is clicked
 * @return {object} Self reference for chaining
 */
function setAllCookies() {

	deleteCookies(); // If the user's preferences have chagned we should delete all current cookies

	let cookieFields = document.querySelectorAll('[name="cookie"]');
	let cookieString = ',';

	for (var i = 0; i < cookieFields.length; i++) {
		cookieString += cookieFields[i].value + ',';
	}

	setCookie(consentCookieName,cookieString, expiry);

	return this;
}

/**
 * setSelectedCookies sets the cookie-consent string to match the selected
 * checkboxes from the cookie pop-up
 * @return {object} Self reference for chaining
 */
function setSelectedCookies() {

	deleteCookies(); // If the user's preferences have chagned we should delete all current cookies

	let selectedFields = document.querySelectorAll('[name="cookie"]:checked');
	let cookieString = ",";

	for (var i = 0; i < selectedFields.length; i++) {
		cookieString += selectedFields[i].value + ",";
	}

	setCookie(consentCookieName, cookieString, expiry);

	setDataLayerValue(dataLayerKey, cookieString);

	return this;
}

/**
 * checkBoxesFromCookie takes the current value stored in the cooker banner
 * user preferences cookies and checks the correct checkboxes based on the
 * content of the cookie
 * @return {object} Self reference for chaining
 */
function checkBoxesFromCookie() {
	let cookieValues = getCookie(consentCookieName);

	cookieValues = cookieValues.split(',');

	for (var i = 0; i < cookieValues.length; i++) {
		let target = document.querySelectorAll('input[name="cookie"][value="' + cookieValues[i] + '"]')[0];

		if (target) {
			target.setAttribute("checked", "checked");
		}
	}

	return this;
}

/**
 * hideBanner hides the cookie banner by removing a class from the body. We do it
 * this was so that the banner is "off" by default when a user doesn't have JavaScript
 * enabled.
 *
 * @return {object} Self reference for method chaining
 */
function hideBanner() {
	document.querySelectorAll(".cookie-overlay")[0].classList.remove("show-cookie-banner");
	document.body.classList.remove("show-cookie-banner");

	return this;
}

/**
 * showBanner hides the cookie banner by adding a class to the body. We add the class so
 * that the cookie banner is "off" by default when the user doesn't have JavaScript
 * @return {object} Self reference for method chaining
 */
function showBanner() {
	document.querySelectorAll(".cookie-overlay")[0].classList.add("show-cookie-banner");
	document.body.classList.add("show-cookie-banner");

	return this;
}
