// App bootstrap
var App = require("core");

var args = arguments[0] || {};

var touchStart = 0,
	touchDiff = 0,
	actionThreshold = (App.Device.width / 3);

$.Row.addEventListener("click", function(_event) {
	Alloy.createController("event", {
		id: args.id
	});
});

$.Row.addEventListener("touchstart", function(_event) {
	touchStart = _event.x;
});

$.Row.addEventListener("touchend", function(_event) {
	if(Math.abs(touchDiff) > actionThreshold) {
		$.Row.fireEvent("remind", {
			id: args.id
		});
	}
	
	touchStart = null;
	
	$.Container.animate({
		left: 0,
		right: 0,
		duration: 100
	});
	
	$.UpvoteBackground.animate({
		width: 0,
		duration: 100
	});
});

$.Row.addEventListener("touchcancel", function(_event) {
	touchStart = null;
	
	$.Container.animate({
		left: 0,
		right: 0,
		duration: 100
	});
	
	$.UpvoteBackground.animate({
		width: 0,
		duration: 100
	});
});

$.Row.addEventListener("touchmove", function(_event) {
	var touchCurrentX = _event.x;
	touchDiff = touchCurrentX - touchStart;
	
	if(touchDiff > 0) {
		touchDiff = 0;
	}
	
	$.Container.left = touchDiff;
	$.Container.right = 0 - touchDiff;
	$.UpvoteBackground.width = Math.abs(touchDiff);
	
	if(Math.abs(touchDiff) > actionThreshold) {
		$.UpvoteBackgroundLabel.opacity = 1;
	} else {
		$.UpvoteBackgroundLabel.opacity = 0.6;
	}
});