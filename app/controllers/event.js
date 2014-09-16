// App bootstrap
var App = require("core");

function toggleReminder(_event) {
	_event.source.image = "images/icon_reminder_active.png";
}

$.EventWindow.addEventListener("open", function(_event) {
	var height = Math.max(($.comments.rect.y + $.comments.rect.height + 20), App.Device.height + 1);
	
	$.Content.contentHeight = height;
});

$.Content.addEventListener("scroll", function(_event) {
	var offset = _event.y;
	var opacity = 1;
	
	if(offset <= 0) {
		var height = 200 - offset;
		var scale = height / 200;
		var transform = Ti.UI.create2DMatrix({
			scale: scale
		});
		
		transform = transform.translate(0, -offset/(2*scale));
		
		$.Image.setTransform(transform);
		$.Image.setOpacity(1);
	} else if(offset > 0) {
		opacity = Math.max(1 - (offset / 200), 0.3);
		
		$.Image.setOpacity(opacity);
	}
});

if(OS_IOS) {
	App.MainWindow.openWindow($.EventWindow);
} else {
	$.EventWindow.open();
}