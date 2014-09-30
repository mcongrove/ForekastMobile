// App bootstrap
var App = require("core"),
	Moment = require("alloy/moment"),
	Forekast = require("model/forekast"),
	Social = require("social"),
	StyledLabel = OS_IOS ? require("ti.styledlabel") : null,
	Util = require("utilities");

var args = arguments[0] || {};

var EVENT = {
	_id: args.id
};

var reminder = false,
	upvote_notice;

function getData() {
	Forekast.getEventById({
		id: EVENT._id,
		success: setData,
		failure: function() {
			var dialog = Ti.UI.createAlertDialog({
				title: "Event Unavailable",
				message: "This event is no longer available for viewing",
				ok: "OK"
			});
			
			dialog.addEventListener("click", function() {
				$.EventWindow.close();
			});
			
			dialog.show();
		}
	});
}

function setData(_data) {
	EVENT = _data;
	
	if(OS_IOS) {
		$.Image.image = EVENT.mediumUrl;
	} else {
		$.Image.backgroundImage = EVENT.mediumUrl;
	}
	
	$.Title.text = EVENT.name;
	$.Time.text = EVENT.is_all_day ? "All Day" : EVENT.local_time;
	$.Subkast.text = Forekast.getSubkastByAbbrev(EVENT.subkast);
	$.UpvoteCount.text = EVENT.upvotes;
	$.TimeFromNow.text = EVENT.is_all_day ? "" : Moment(EVENT.local_date + " " + EVENT.local_time, "YYYY-MM-DD h:mm A").fromNow();
	$.Author.text = "by " + EVENT.user;
	
	var description = Util.linkify(EVENT.description);
	
	if(OS_IOS) {
		var html = "<style type='text/css'>body {background: #000D16;font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', Helvetica, Arial, sans-serif;font-size: 16px;color: #FFF;}a {color: #4ED5C3;text-decoration: none;}p, br {margin: 20px 0 0;}</style>";
		
		var label = StyledLabel.createLabel({
			height: Ti.UI.SIZE,
			top: 25,
			right: 0,
			left: 0,
			html: html + description
		});
		
		label.addEventListener("click", function(_event) {
			if(_event.url) {
				Ti.Platform.openURL(_event.url);
			}
		});
	} else {
		var label = Ti.UI.createLabel({
			height: Ti.UI.SIZE,
			top: 25,
			right: 0,
			left: 0,
			html: description
		});
	}
	
	$.Content.add(label);
	
	getComments();
	
	App.logEvent("Event:Open", {
		eventId: EVENT._id
	});
}

function getComments() {
	Forekast.getCommentsByEventId({
		id: EVENT._id,
		success: setComments,
		failure: setComments
	});
}

function setComments(_data) {
	var rows = [],
		comments = [];
	
	// TODO: v1.1
	if(_data.length < 1) {
		$.Comments.backgroundGradient = {};
		
		return;
	}
	
	// This loops through all the replies and grabs EVERY comment
	extractComments(_data, 0);
	
	// Hacking, because the gradient doesn't update when content is added
	$.Comments.setBackgroundGradient({
		type: "linear",
		startPoint: {
			x: 0,
			y: 0
		},
		endPoint: {
			x: 0,
			y: "100%"
		},
		colors: [
			{
				color: "#2B2D38",
				offset: 0
			},
			{
				color: "#2B2D38",
				offset: 0.5
			},
			{
				color: "#000D16",
				offset: 1
			}
		]
	});
}

function extractComments(_data, _depth) {
	for(var i = 0, x = _data.length; i < x; i++) {
		var comment = _data[i];
		
		var commentView = Alloy.createController("ui/comment", {
			author: comment.username,
			comment: comment.message,
			depth: _depth
		}).getView();
		
		$.CommentsContainer.add(commentView);
		
		if(comment.replies.length > 0) {
			extractComments(comment.replies, _depth + 1);
		}
	}
}

/*
// TODO: v1.1
function toggleReminder(_event) {
	var picker = Alloy.createController("ui/picker");
	var selectedValue = reminder === false ? Ti.App.Properties.getInt("ReminderDefault", 0) : reminder;
	
	var options = [
		{
			title: "15 min. before",
			value: 0,
			selected: selectedValue == 0 ? true : false
		},
		{
			title: "1 hr. before",
			value: 1,
			selected: selectedValue == 1 ? true : false
		},
		{
			title: "4 hr. before",
			value: 2,
			selected: selectedValue == 2 ? true : false
		},
		{
			title: "1 day before",
			value: 3,
			selected: selectedValue == 3 ? true : false
		}
	];
	
	if(reminder !== false) {
		options.unshift({
			title: "Cancel",
			value: "cancel"
		});
	}
	
	picker.setOptions(options);
	picker.setInstructions("When should we remind you of this event?");
	
	picker.setCallback(function(_data) {
		if(_data !== false) {
			if(_data == "cancel") {
				reminder = false;
				
				_event.source.image = "images/icon_reminder.png";
			} else {
				reminder = _data;
				
				_event.source.image = "images/icon_reminder_active.png";
				
				App.logEvent("Event:Remind", {
					eventId: 12345
				});
			}
		}
		
		$.EventWindow.remove(picker.getView());
	});
	
	$.EventWindow.add(picker.getView());
	
	picker.open();
}
*/

$.EventWindow.addEventListener("open", function(_event) {
	$.ScrollView.animate({
		opacity: 1,
		duration: 500,
		delay: 250
	});
});

/*
// TODO: v1.1
$.Upvote.addEventListener("click", function() {
	if(!upvote_notice) {
		upvote_notice = Alloy.createController("ui/upvote");
		
		$.EventWindow.add(upvote_notice.getView());
	}
	
	upvote_notice.show();
	
	App.logEvent("Event:Upvote", {
		eventId: 12345
	});
});
*/


$.ScrollView.addEventListener("scroll", function(_event) {
	var offset = _event.y;
	var opacity = 1;
	
	if(offset <= 0) {
		if(OS_IOS) {
			var height = 200 - offset;
			var scale = height / 200;
			var transform = Ti.UI.create2DMatrix({
				scale: scale
			});
			
			transform = transform.translate(0, -offset/(2*scale));
			
			$.Image.setTransform(transform);
		}
		
		$.Image.setOpacity(1);
	} else if(offset > 0) {
		opacity = Math.max(1 - (offset / 200), 0.3);
		
		$.Image.setOpacity(opacity);
	}
});

/*
// TODO: v1.1
$.CommentBox.addEventListener("focus", function(_event) {
	if($.CommentBox.value == "\nLeave a comment...") {
		$.CommentBox.value = "";
		$.CommentBox.textAlign = "left";
		$.CommentBox.color = "#7A7F9E";
	}
});

// TODO: v1.1
$.CommentBox.addEventListener("blur", function(_event) {
	if($.CommentBox.value.length == 0) {
		$.CommentBox.color = "#3E4252";
		$.CommentBox.textAlign = "center";
		$.CommentBox.value = "\nLeave a comment...";
	}
});

// TODO: v1.1
$.CommentBox.addEventListener("return", function(_event) {
	App.logEvent("Event:Comment", {
		eventId: 12345
	});
});

// TODO: v1.1
$.ScrollView.addEventListener("click", function(_event) {
	$.CommentBox.blur();
});
*/

$.Share.addEventListener("click", function(_event) {
	Social.share("https://forekast.com/events/show/" + EVENT._id);
	
	App.logEvent("Event:Share", {
		eventId: 12345
	});
});

if(OS_IOS) {
	App.MainWindow.openWindow($.EventWindow);
} else {
	$.EventWindow.open();
}

getData();