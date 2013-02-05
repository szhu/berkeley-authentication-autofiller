// ==UserScript==
// @name           Berkeley CalNet Authentication Service Autofiller
// @namespace      http://interestinglythere.com/
// ==/UserScript==


if (document.forms.length==0) {throw "No login form on page."}

function extensionId(suffix) {
	return 'bnjahojpoacbilihlikppchnklabfmjp' + (suffix ? '_'+suffix : '');
}
function extensionField(suffix) {
	return 'com.google.chrome.extension.bnjahojpoacbilihlikppchnklabfmjp' + (suffix ? '.'+suffix : '');
}

username = function() {
	var self = Object();
	self.field = extensionField('CalNetAutofill_username');
	self.buttonId = extensionId('CalNetAutofill_button');
	self.makeButton = function() {
		var a = document.createElement('button');
		a.id = self.buttonId;
		a.setAttribute('type', 'button');
		a.innerHTML = 'Save ID only';
		return a
	}
	self.getButton = function() {return document.querySelector('#' + self.buttonId)};
	self.buttonContainer = document.querySelector('label[for="username"]');
	self.valueField = document.querySelector('#username');

	self.getSavedValue = function() {return localStorage.getItem(self.field) || '';}
	self.oldValue = self.getSavedValue();
	self.saveValue = function() {
		if (!self.valueField) {throw "Can't find username field."}
		var newValue = self.valueField.value;
		console.log('Saving ID:', newValue);
		if (!newValue) {localStorage.removeItem(self.field)}
		else {localStorage.setItem(self.field, newValue)}
		location.reload(false);
		console.log('ID saved.')
	}
	self.loadValue = function() {
		var savedValue = self.getSavedValue()
		if (self.valueField && savedValue) {
			self.valueField.value = savedValue;
			return true;
		}
		// else {return false};
		console.log('Saved ID loaded:', savedValue)
	}
	self.getDomValue = function() {return self.valueField.value}
	self.showButton = function() {
		var button = self.getButton();
		button.style.display  = '';
	}

	self.injectButton = function() {
		var button = self.button = self.makeButton();
		self.buttonContainer.appendChild(button);
		button.onclick = self.saveValue;
		console.log('save-id link inserted.')
	}
	return self;
}()

password = function() {
	var self = Object();
	self.field = extensionField('CalNetAutofill_savePassword');
	self.labelId = extensionId('CalNetAutofill_passwordSave');
	self.buttonId = extensionId('CalNetAutofill_passwordSaveBox');
	self.buttonHoverText = 'This option allows Chrome to save the passphrase. Chrome’s own password-saving mechanism will be used, i.e., saved passphrases can be managed from Chrome’s settings page at chrome://settings. Click the Help link for more details.';
	self.enableWarnText = 'Chrome will save the passphrase. Make sure you’ve enabled password-saving in Chrome’s settings, then log in manually once and click Save Password when Chrome prompts you. If Chrome doesn’t prompt you, then your password may have already been saved, or you may have turned on Chrome’s password-saving feature.\n\nClick the Help link for more details.';
	self.disableWarnText = 'Chrome will stop autofilling a passphrase, but the passphrase may still be saved on your computer.\n\nClick the Help link for more details.';

	self.makeButton = function() {
		var button = self.button = document.createElement('input');
		button.setAttribute('type', 'checkbox');
		button.id = self.buttonId;
		return button;
	}
	self.makeSpan = function() {
		var span = self.span = document.createElement('span');
		span.innerHTML = 'Save Login';
		return span;
	}
	self.makeLabel = function() {
		var label = self.label = document.createElement('label');
		label.setAttribute('for', self.buttonId);
		label.id = self.labelId;
		label.setAttribute('title', self.buttonHoverText)
		label.appendChild(self.makeButton());
		label.appendChild(self.makeSpan());
		return label;
	}
	self.labelContainer = document.querySelector('label[for="password"]');
	self.injectLabel = function() {
		var label = self.label = self.makeLabel();
		self.labelContainer.appendChild(label);
		label.onchange = self.saveValue;
		console.log('save-password link inserted.')
	}

	self.valueField = document.querySelector('#password');

	self.getSavedValue = function() {return localStorage.getItem(self.field)=='1';}
	self.oldValue = self.getSavedValue();
	self.saveValue = function(event, hideWarning) {
		var newValue = self.getDomValue();
		var oldValue = self.getSavedValue(); 
		console.log(oldValue, '->', newValue)
		console.log('Saving save-password state:', newValue);

		if (newValue) {
			var response = hideWarning||confirm(self.enableWarnText);
			if (response) {localStorage.setItem(self.field, '1'); autofill.enable(); if(newValue!=oldValue) {location.reload(false);}}
			else {self.button.checked = false; throw "User canceled."}
		}
		else {
			var response = hideWarning||confirm(self.disableWarnText);
			if (response) {localStorage.removeItem(self.field); if(newValue!=oldValue) {location.reload(false);}}
			else {self.button.checked = true; throw "User canceled."}
		}
		console.log('Save-password state saved.')
	}
	self.loadValue = function() {
		var savedValue = self.getSavedValue()
		if (self.button) {
			self.button.checked = savedValue;
			console.log('Saved save-password state loaded:', savedValue);
			return true;
		}
		else {return false};
	}
	self.getDomValue = function() {
		if (!self.button) {throw "Can't find save-password checkbox."}
		var isChecked = self.button.checked;
		if (!isChecked) {
			submit.button.checked = false;
			submit.saveValue(undefined, true);
		}
		return isChecked;
	}

	return self;
}()


submit = function() {
	var self = Object();
	self.field = extensionField('CalNetAutofill_autoSubmit');
	self.labelId = extensionId('CalNetAutofill_autoSubmit');
	self.buttonId = extensionId('CalNetAutofill_autoSubmitBox');
	self.buttonHoverText = 'This option allows the extension to "click" the Sign In button for you. This option requires, of course, that the passphrase be saved. Auto-login will always be disabled on:\n  https://auth.berkeley.edu/cas/login\nThis is so that you can always access the Berkeley Authentication Autofiller’s settings by going to auth.berkeley.edu.';
	self.enableWarnText = 'Chrome will save your passphrase and automatically "click" the Sign In button whenever the CalNet login form is loaded. If the passphrase is not already saved, you will need to make sure you’ve enabled password-saving in Chrome’s settings, then log in manually and click Save Password when Chrome prompts you. If Chrome doesn’t prompt you, then your password may have already been saved, or you may have turned on Chrome’s password-saving feature. To disable auto-login again, go to auth.berkeley.edu.\n\nClick the Help link for more details.';
	self.makeButton = function() {
		var button = self.button = document.createElement('input');
		button.setAttribute('type', 'checkbox');
		button.id = self.buttonId;
		return button;
	}
	self.makeSpan = function() {
		var span = self.span = document.createElement('span');
		span.innerHTML = 'Auto-login';
		return span;
	}
	self.makeLabel = function() {
		var label = self.label = document.createElement('label');
		label.setAttribute('for', self.buttonId);
		label.id = self.labelId;
		label.setAttribute('title', self.buttonHoverText)
		label.appendChild(self.makeButton());
		label.appendChild(self.makeSpan());
		return label;
	}
	self.labelContainer = document.querySelector('p.submit');
	self.labelReferenceElement = document.querySelector('p.submit > input.button[type="submit"]');
	self.injectLabel = function() {
		var label = self.label = self.makeLabel();
		// self.labelContainer.appendChild(label);
		self.labelReferenceElement.parentNode.insertBefore(label, self.labelReferenceElement.nextSibling);
		label.onchange = self.saveValue;
		console.log('auto-login link inserted.')
	}

	self.getSavedValue = function() {return localStorage.getItem(self.field)=='1';}
	self.oldValue = self.getSavedValue();
	self.saveValue = function(event, hideWarning) {
		var newValue = self.getDomValue();
		console.log('Saving auto-login state:', newValue);
		if (newValue) {
			var response = hideWarning || confirm(self.enableWarnText);
			if (response) {localStorage.setItem(self.field, '1'); autofill.enable();}
			else {self.button.checked = false; throw "User canceled."}
		}
		else {
			localStorage.removeItem(self.field);
		}
		console.log('auto-login state saved.')
	}
	self.loadValue = function() {
		var savedValue = self.getSavedValue()
		if (self.button) {
			self.button.checked = savedValue;
			console.log('Saved auto-login state loaded:', savedValue);
			return true;
		}
		else {return false};
	}
	self.getDomValue = function() {
		if (!self.button) {throw "Can't find auto-login checkbox."}
		var isChecked = self.button.checked;
		if (isChecked) {
			password.button.checked = true;
			password.saveValue(undefined, true);
		}
		return isChecked;
	}

	return self;
}()



indicator = function() {
	var self = Object();
	self.field = extensionField('CalNetAutofill_indicator');
	self.id = extensionId('CalNetAutofill_indicator');
	self.src="data:image/gif;base64,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"
	self.make = function() {
		var e = document.createElement('img');
		e.id = self.id;
		e.setAttribute('src', self.src);
		return e;
	}
	self.container = document.querySelector('p.submit');
	self.referenceElement = document.querySelector('p.submit > input.button[type="submit"]');
	self.form = document.querySelector('form#loginForm');
	self.inject = function() {
		var e = self.element = self.make()
		self.referenceElement.parentNode.insertBefore(e, self.referenceElement.nextSibling);
		console.log('indicator inserted.')
	}
	self.show = function() {
		self.element.style.visibility = 'visible';
	}
	self.form.onsubmit = self.show;

	return self;
}()

error = function() {
	var self = Object();
	self.selector = '#status';
	self.exists = function() {
		var element = document.querySelector(self.selector);
		return element && element.innerHTML;
	}
	return self;
}()



function injectStyles() {
	var e = document.createElement('style');
	e.innerHTML += 
	'@media screen and (max-width: 480px) { label[for="username"], label[for="password"] {width:  86% } }\n' + 
	'@media screen and (min-width: 481px) { label[for="username"], label[for="password"] {width: 340px} }\n' + 
	'@media screen and (min-width: 481px) { label[for="username"], label[for="password"] {width: 340px} }\n' + 
	'@media screen and (min-width: 321px) { #content {-moz-box-shadow: 2px 5px 50px 5px rgba(0,0,0,0.2); -webkit-box-shadow: 2px 5px 50px 5px rgba(0,0,0,0.2); box-shadow: 2px 5px 50px 5px rgba(0,0,0,0.2);} }\n' + 
	'#loginForm label[for="username"], label[for="password"] {display: block}\n' + 
	'#loginForm br {display: none}\n' + 
	'a.plainlink {color: inherit; font-weight: inherit}\n' + 
	'.copyright {padding: 15px 15px; text-align: center;}\n' + 
	'#' + username.buttonId + '{font-weight: 400; float: right; cursor: pointer; text-decoration: none}\n' +
	'#' + password.labelId + '{font-weight: 400; float: right; cursor: pointer; display: block; width: auto; padding: 0; margin: 0; text-align: inherit; font-size: 0.9em; }\n' + 
	'#' + password.buttonId + '{float: none; clear: none; vertical-align: 11%; margin-right: 5px;}\n' + 
	'#' + submit.labelId + '{font-weight: 400; float: left; cursor: pointer; display: block; width: auto; margin: 0; text-align: inherit; clear: none; font-size: 0.8em; padding: 19px 10px; }\n' + 
	'#' + submit.buttonId + '{float: none; clear: none; vertical-align: 11%; margin-right: 5px;}\n' + 
	'#' + indicator.id + '{float: left; display: block; clear: none; padding: 23px 10px 23px 0px; visibility: hidden;}\n' + 
	'';
	document.documentElement.appendChild(e);
}

function insertCopyrightExtras() {
	var container = document.querySelector('div.copyright > small');
	container.innerHTML += '<br>Credential-saving features brought to you by the <a class="plainlink" href="https://chrome.google.com/webstore/detail/bnjahojpoacbilihlikppchnklabfmjp" onclick="toggle();pageScroll();return false" target="_blank">Berkeley Authentication Autofiller</a> by Sean Zhu.';
}
function insertHelpExtras() {
	var container = document.querySelector('div#toggleHelpText');
	container.innerHTML = '<h3 class="calnet-help">The <a class="plainlink" href="https://chrome.google.com/webstore/detail/bnjahojpoacbilihlikppchnklabfmjp" target="_blank">Berkeley Authentication Autofiller</a> Help</h3><p><a class="plainlink" href="https://chrome.google.com/webstore/detail/bnjahojpoacbilihlikppchnklabfmjp" target="_blank">Berkeley Authentication Autofiller</a> is a Chrome extension that automates the tedious task of re-entering your CalNet login credentials. This extension gives you the option to save your CalNet ID and/or passphrase with Chrome.</p><p><b>What are my options?</b> You can choose to have your ID saved, your ID and passphrase saved, or your ID and passphrase saved and have the extension log you in autmatically.</p><p><b>How are passphrases saved?</b> Passphrases are saved using Chrome’s own password-saving mechanism. This means that password-saving needs to be turned on in Chrome’s settings. To save your passphrase, check the Save Passphrase option, log in manually, and click Save Password when Chrome prompts you. To delete a saved passphrase, go to Chrome’s settings page at <a class="plainlink" href="chrome://settings">chrome://settings</a>.</p><p><b>How do I turn off auto-login?</b> If you have enabled auto-login and want to turn it off again, you can do so by going to <a class="plainlink" href="https://auth.berkeley.edu/">auth.berkeley.edu</a>, where auto-login is intentionally disabled on that page. To completely disable or uninstall Berkeley Authentication Automator, go to Chrome’s Extensions page at <a class="plainlink" href="chrome://extensions">chrome://extensions</a>.</p><p><b>Disclaimer.</b> Passphrase-saving may put your CalNet account at risk should an intruder gain physical access to your computer. By using passphrase-saving and/or auto-login, you agree to continue to assume responsibility for the security of your CalNet account.</p><p><b>Credits.</b> Berkeley Authentication Autofiller is developed and maintained by <a class="plainlink" href="http://interestinglythere.com/" target="_blank">Sean Zhu</a>. Props to the competing <a class="plainlink" href="https://chrome.google.com/webstore/detail/kmgbfgllkogcplifbeibkghlaonjccel" target="_blank">Auto AirBears</a> extension for motivating me to add support for saving passphrases, and to UC Berkeley for having such a nice single-sign-on system.</p>' + container.innerHTML;
}

autofill = function() {
	var self = Object();
	self.enable = function() {
		if (document.getElementById("loginForm")) {
			if (document.getElementById("loginForm").username) {
				document.getElementById("loginForm").username.setAttribute("autocomplete","on");
			}
			if (document.getElementById("loginForm").password) {
				document.getElementById("loginForm").password.setAttribute("autocomplete","on");
			}
		}
	}
	self.submit = function() {
		var form = document.querySelector('form#loginForm');
		setTimeout(function(){
			if (password.valueField.value) {
				form.submit();
				form.onsubmit();
			}
		}, 500);
	}
	return self;
}()

function isSpecialPage() {return !location.search}

canAutoSubmit = true;
if (isSpecialPage()) {canAutoSubmit = false; console.log('This page is a very special page. Auto-submit will be disabled.')}
if (error.exists()) {canAutoSubmit = false; console.log('This page appears to have an error message. Auto-submit will be disabled.')}

if (username.getDomValue()) {console.log('Old ID exists, so username not filled.', username.oldValue); canAutoSubmit = false;}
else {username.loadValue(); if (username.getDomValue()) {password.valueField.focus()}}

if (password.getSavedValue()) {autofill.enable();}
else {console.log('Saving password is disabled.'); canAutoSubmit = false;}

if (submit.getSavedValue() && canAutoSubmit) {autofill.submit();}
else {console.log('Auto-login is disabled.');}

username.injectButton();
password.injectLabel(); password.loadValue();
submit.injectLabel(); submit.loadValue();
indicator.inject();


injectStyles();
insertCopyrightExtras();
insertHelpExtras();
