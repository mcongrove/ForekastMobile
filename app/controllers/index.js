// App bootstrap
var App = require("core");

// Save access to our main window
if(OS_IOS) {
	App.MainWindow = $.NavWindow;
} else {
	App.MainWindow = $.ListWindow.getView();
}

// Init our app singleton
App.init();