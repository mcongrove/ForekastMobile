// App bootstrap
var App = require("core");

var args = arguments[0] || {};

$.Row.addEventListener("click", function(_event) {
	if(OS_IOS && Alloy.isTablet) {
		if(args.id == App.EventId) {
			return;
		}
	}

	var eventWindow = Alloy.createController("event", {
		id: args.id
	}).getView();

	if(OS_IOS) {
		if(Alloy.isHandheld) {
			App.MainWindow.openWindow(eventWindow);
		} else {
			App.DetailWindow.openWindow(eventWindow);
		}
	} else {
		eventWindow.open();
	}
});

/*
// TODO: v1.2
$.Upvotes.addEventListener("click", function(_event) {
	$.Row.fireEvent("remind", {
		id: args.id
	});
});
*/