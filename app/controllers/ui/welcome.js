// App bootstrap
var App = require("core");

if(OS_IOS && App.Device.versionMajor >= 7) {
	$.Content.top = 40;
}

$.Done.addEventListener("click", function() {
	$.WelcomeWindow.close();
});