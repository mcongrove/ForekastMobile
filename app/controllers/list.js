// App bootstrap
var App = require("core");

var item_height = 85;
var image_height = 55;
var item_offset_per_px = 0;
var item_cell_offset = 0;

function init() {
	for(var i = 0, x = $.Events.children.length; i < x; i++) {
		var child = $.Events.children[i].children[0].children[0];
		
		/*
		child.updateViews({
			".image": {
				top: cellOffset(i, offset)
			}
		});
		*/
		
		child.top = calculateItemOffset(i, 0);
	}
}

function openSettings() {
	var SettingsWindow = Alloy.createController("settings").getView();
	
	SettingsWindow.open();
}

$.Events.addEventListener("click", function() {
	var event = Alloy.createController("event");
});

$.ListWindow.addEventListener("open", function() {
	$.Overlay.animate({
		opacity: 0,
		duration: 500
	});
	
	init();
});

$.Events.addEventListener("scroll", function(_event) {
	var offset = _event.source.contentOffset.y;
	
	for(var i = 0, x = $.Events.children.length; i < x; i++) {
		var child = $.Events.children[i].children[0].children[0];
		
		/*
		child.updateViews({
			".image": {
				top: cellOffset(i, offset)
			}
		});
		*/
		
		child.top = calculateItemOffset(i, offset);
	}
});

function calculateItemOffset(index, scroll_offset) {
	var scroll_offset = scroll_offset || 0;
	
	return ((scroll_offset - item_height) * item_offset_per_px) - (index * item_cell_offset);
}

$.Events.addEventListener("postlayout", function postLayoutListener(_event) {
	var height = _event.source.rect.height;
	
	if(height > 0 && height <= App.Device.height) {
		var diff = image_height - (item_height / 3);
		
		item_offset_per_px = diff / height;
		item_cell_offset = item_offset_per_px * item_height;
		
		$.Events.removeEventListener("postlayout", postLayoutListener);
	}
});