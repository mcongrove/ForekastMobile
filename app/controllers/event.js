// App bootstrap
var App = require("core"),
	Moment = require("alloy/moment"),
	Forekast = require("model/forekast"),
	Social = require("social"),
	StyledLabel = OS_IOS ? require("ti.styledlabel") : null,
	Util = require("utilities"),
	Reminder = require("reminder");

var args = arguments[0] || {};

var EVENT = {
	_id: args.id
};

var upvote_notice;
// TODO: v1.1
// var reminder = false;

function init() {
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

	if(OS_IOS) {
		if(Reminder.isReminderSet(EVENT._id)) {
			$.Reminder.image = "/images/icon_reminder_active.png";
		}
	}
}

function setData(_data) {
	EVENT = _data;

	EVENT.datetime = Moment(EVENT.datetime);

	var displayTime = "",
		displayRelativeTime = "";

	// Handle event types differently
	if(EVENT.time_format == "tv_show") {
		var hour = EVENT.local_time.split(":")[0];
		var isDST = Moment(EVENT.local_date).isDST();
		var offset = isDST ? "-0400" : "-0500";

		EVENT.datetime = Moment(EVENT.local_date + " " + EVENT.local_time + " " + offset, "YYYY-MM-DD h:mm A Z");

		displayTime = hour + "/" + (parseInt(hour, 10) - 1) + "c";
		displayRelativeTime = EVENT.datetime.fromNow();
	} else if(EVENT.is_all_day) {
		EVENT.datetime = Moment();

		displayTime = "All Day";
		displayRelativeTime = "";
	} else {
		displayTime = EVENT.datetime.format("h:mma");
		displayRelativeTime = EVENT.datetime.fromNow();
	}

	if(EVENT.width == 0) {
		EVENT.mediumUrl = "/images/empty_large.png";
	}

	if(OS_IOS) {
		$.Image.image = EVENT.mediumUrl;
	} else {
		$.Image.backgroundImage = EVENT.mediumUrl;
	}

	$.Title.text = EVENT.name;
	$.Time.text = displayTime;
	$.Subkast.text = Forekast.getSubkastByAbbrev(EVENT.subkast);
	$.UpvoteCount.text = EVENT.upvotes;
	$.TimeFromNow.text = displayRelativeTime;
	$.Author.text = "by " + EVENT.user;

	var description = Util.linkify(EVENT.description);

	if(OS_IOS) {
		var html = "<style type='text/css'>body {font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', Helvetica, Arial, sans-serif;font-size: 16px;color: #FFF;}a {color: #4ED5C3;text-decoration: none;}p, br {margin: 20px 0 0;}</style>";

		var label = StyledLabel.createLabel({
			height: Ti.UI.SIZE,
			top: 25,
			right: 0,
			left: 0,
			backgroundColor: "transparent",
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
			color: "#FFF",
			html: description
		});
	}

	$.Content.add(label);

	getComments();

	App.logEvent("Event:Open", {
		eventId: EVENT._id,
		daysAhead: EVENT.datetime.diff(Moment(), "days")
	});

	// Hide reminder option if event is in the past
	if(OS_IOS) {
		if(EVENT.datetime.diff(Moment(), "hours") < 0) {
			$.Reminder.visible = false;
		}
	}
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

		if(comment.status == "active") {
			var commentView = Alloy.createController("ui/comment", {
				author: comment.username,
				comment: comment.message,
				depth: _depth
			}).getView();

			$.CommentsContainer.add(commentView);
		}

		if(comment.replies.length > 0) {
			extractComments(comment.replies, _depth + 1);
		}
	}
}

function toggleReminder(_event) {
	// Check if event is still to occur
	if(EVENT.datetime.diff(Moment(), "minutes") > 0) {
		if(OS_IOS) {
			if(Reminder.isReminderSet(EVENT._id)) {
				Reminder.cancelReminder(EVENT._id);

				$.Reminder.image = "/images/icon_reminder.png";

				return;
			} else {
				$.Reminder.image = "/images/icon_reminder_active.png";
			}
		}

		Reminder.setReminder({
			id: EVENT._id,
			name: EVENT.name,
			datetime: EVENT.datetime,
			atStart: (EVENT.datetime.diff(Moment(), "hours") < 2) ? true : false
		});

		App.logEvent("Event:Remind", {
			eventId: EVENT._id
		});
	} else {
		// For Android, let them know the reminder wasn't set
		if(OS_ANDROID) {
			var toast = Ti.UI.createNotification({
				message: "This event has already occurred; reminder not set",
				duration: Ti.UI.NOTIFICATION_DURATION_LONG
			});

			toast.show();
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
				
				$.Reminder.image = "/images/icon_reminder.png";
			} else {
				reminder = _data;
				
				$.Reminder.image = "/images/icon_reminder_active.png";
				
				App.logEvent("Event:Remind", {
					eventId: EVENT._id
				});
			}
		}
		
		$.EventWindow.remove(picker.getView());
	});
	
	$.EventWindow.add(picker.getView());
	
	picker.open();
}

// TODO: v1.1
$.Upvote.addEventListener("click", function() {
	if(!upvote_notice) {
		upvote_notice = Alloy.createController("ui/upvote");
		
		$.EventWindow.add(upvote_notice.getView());
	}
	
	upvote_notice.show();
	
	App.logEvent("Event:Upvote", {
		eventId: EVENT._id
	});
});

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
		eventId: EVENT._id
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
		eventId: EVENT._id
	});
});

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

			transform = transform.translate(0, -offset / (2 * scale));

			$.Image.setTransform(transform);
		}

		$.Image.setOpacity(1);
	} else if(offset > 0) {
		opacity = Math.max(1 - (offset / 200), 0.3);

		$.Image.setOpacity(opacity);
	}
});

$.EventWindow.addEventListener("open", function(_event) {
	$.ScrollView.animate({
		opacity: 1,
		duration: 500,
		delay: 250
	});
});

init();