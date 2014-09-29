// App bootstrap
var App = require("core");

var args = arguments[0] || {};

$.Row.addEventListener("click", function(_event) {
	Alloy.createController("event", {
		id: args.id
	});
});

$.Upvotes.addEventListener("click", function(_event) {
	$.Row.fireEvent("remind", {
		id: args.id
	});
});