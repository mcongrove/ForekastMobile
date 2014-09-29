// App bootstrap
var App = require("core");

var args = arguments[0] || {};

var isTouching = false,
	touchStartX = null,
	touchDiffX = null,
	actionThreshold = (App.Device.width / 3);

$.Row.addEventListener("touchstart", function(_event) {
	isTouching = true;
	touchStartX = _event.x;
});

$.Row.addEventListener("touchend", function(_event) {
	if(Math.abs(touchDiff) > actionThreshold) {
		$.Row.fireEvent("remind", {
			id: args.id
		});
	}
	
	isTouching = false;
	touchStartX = null;
	
	$.Container.animate({
		left: 0,
		duration: 100
	});
	
	$.UpvoteBackground.animate({
		width: 0,
		duration: 100
	});
});

$.Row.addEventListener("touchcancel", function(_event) {
	isTouching = false;
	touchStartX = null;
	
	$.Container.animate({
		left: 0,
		duration: 100
	});
	
	$.UpvoteBackground.animate({
		width: 0,
		duration: 100
	});
});

$.Row.addEventListener("touchmove", function(_event) {
	if(isTouching) {
		var touchCurrentX = _event.x;
		touchDiff = touchCurrentX - touchStartX;
		
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
	}
});