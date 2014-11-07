// App bootstrap
var App = require("core");

// Save access to our main window
if(OS_IOS) {
	if(Alloy.isHandheld) {
		App.MainWindow = $.NavWindow;
	} else {
		App.MainWindow = $.SplitWindow;
		App.MasterWindow = $.MasterWindow;
		App.DetailWindow = $.DetailWindow;
	}
} else {
	App.MainWindow = $.ListWindow.getView();
}

// Init our app singleton
App.init();