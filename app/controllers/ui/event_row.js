// App bootstrap
var App = require("core");

var args = arguments[0] || {};

$.Row.addEventListener("click", function(_event) {
	if(OS_IOS && Alloy.isTablet) {
		if(args.event_id == App.EventId) {
			return;
		}
	}

	var event = Alloy.createController("event", {
		event_id: args.event_id
	}).getView();

	if(OS_IOS) {
		if(Alloy.isHandheld) {
			App.MainWindow.openWindow(event);
		} else {
			App.DetailWindow.openWindow(event);
		}
	} else {
		event.open();
	}
});

/*
// TODO: v1.2
$.Upvotes.addEventListener("click", function(_event) {
	$.Row.fireEvent("remind", {
		id: args.event_id
	});
});
*/