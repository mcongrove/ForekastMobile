// App bootstrap
var App = require("core");

if(OS_IOS && App.Device.versionMajor >= 7) {
	$.Content.top = $.Content.top + 20;
}

$.Done.addEventListener("click", function() {
	$.WelcomeWindow.close();
});

Ti.App.Properties.setBool("WelcomeShown", true);