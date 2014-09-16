// App bootstrap
var App = require("core");

function toggleReminder(_event) {
	_event.source.image = "images/icon_reminder_active.png";
}

$.EventWindow.addEventListener("open", function(_event) {
	$.ScrollView.animate({
		opacity: 1,
		duration: 500,
		delay: 0
	});
	
	var contentHeight = ($.Comments.rect.y + $.Comments.rect.height + 5);
	var minHeight = (App.Device.height + 1);
	
	if(contentHeight < minHeight) {
		$.ScrollView.contentHeight = minHeight;
	}
});

$.ScrollView.addEventListener("scroll", function(_event) {
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

$.CommentBox.addEventListener("focus", function(_event) {
	if($.CommentBox.value == "\nLeave a comment...") {
		$.CommentBox.value = "";
		$.CommentBox.textAlign = "left";
		$.CommentBox.color = "#7A7F9E";
	}
});

$.CommentBox.addEventListener("blur", function(_event) {
	if($.CommentBox.value.length == 0) {
		$.CommentBox.color = "#3E4252";
		$.CommentBox.textAlign = "center";
		$.CommentBox.value = "\nLeave a comment...";
	}
});

$.ScrollView.addEventListener("click", function(_event) {
	$.CommentBox.blur();
});

if(OS_IOS) {
	App.MainWindow.openWindow($.EventWindow);
} else {
	$.EventWindow.open();
}