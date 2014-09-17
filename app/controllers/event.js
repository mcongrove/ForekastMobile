// App bootstrap
var App = require("core");

var StyledLabel = require("ti.styledlabel");

var upvote_notice;

function init() {
	var html = "<style type='text/css'>body {background: #000D16;font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', Helvetica, Arial, sans-serif;font-size: 16px;color: #FFF;}a {color: #4ED5C3;text-decoration: none;}p, br {margin: 20px 0 0;}</style>";
	var text = "On the day of the launch, Spaceflight now should post a link to the <a target='_blank' href='http://www.spaceflightnow.com/'>livestream coverage here.</a><br> If you've never watched a live launch, I highly recommend catching one. It's pretty awe-inspiring. You can set a reminder to catch this one with the bell icon directly above this text box.  <a target='_blank' href='http://www.ulalaunch.com/'>ulalaunch.com</a> Will also have a webcast which they indicate begins 20 minutes before launch.";

	var label = StyledLabel.createLabel({
		height: Ti.UI.SIZE,
		top: 25,
		right: 0,
		left: 0,
		html: html + text
	});
	
	label.addEventListener("click", function(_event) {
		if(_event.url) {
			Ti.Platform.openURL(_event.url);
		}
	});
	
	$.Content.add(label);
}

function toggleReminder(_event) {
	_event.source.image = "images/icon_reminder_active.png";
}

$.EventWindow.addEventListener("open", function(_event) {
	$.ScrollView.animate({
		opacity: 1,
		duration: 500,
		delay: 250
	});
});

$.Upvote.addEventListener("click", function() {
	if(!upvote_notice) {
		upvote_notice = Alloy.createController("ui/upvote");
		
		$.EventWindow.add(upvote_notice.getView());
	}
	
	upvote_notice.show();
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

init();