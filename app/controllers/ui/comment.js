// App bootstrap
var App = require("core");

var args = arguments[0] || {};

function init() {
	$.Author.text = args.author;
	$.Text.text = args.comment;

	if(args.depth > 0) {
		var offset = args.depth * 10,
			max = (App.Device.width / 3);

		if(offset > max) {
			offset = Math.round(max / 10) * 10;
		}

		$.Author.left = offset;
		$.Text.left = offset;
	}
}

init();