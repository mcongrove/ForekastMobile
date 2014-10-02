// App bootstrap
var App = require("core");

var args = arguments[0] || {};

$.Row.addEventListener("click", function(_event) {
	var event = Alloy.createController("event", {
		id: args.id
	}).getView();

	if(OS_IOS) {
		App.MainWindow.openWindow(event);
	} else {
		event.open();
	}
});

/*
// TODO: v1.1
$.Upvotes.addEventListener("click", function(_event) {
	$.Row.fireEvent("remind", {
		id: args.id
	});
});
*/