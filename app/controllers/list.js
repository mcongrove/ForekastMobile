// App bootstrap
var App = require("core"),
	Moment = require("alloy/moment"),
	Forekast = require("model/forekast");

if(OS_IOS) {
	/**
	 * Parallax Effect Calculations
	 * 
	 * Basically, we're determining how far away an element is from the center of the screen (as a percent).
	 * 
	 * The top of the screen is -100% away from center, the bottom is +100% away.
	 * 
	 * We take that percent and multiply it by the max distance the image can slide up or down;
	 * so, if an image can slide up 20px and it's at the bottom of the screen (100%), 20*100% = 20...
	 * the image should be offset 20px down.
	 * 
	 * If the image is in the middle, it's 0% away from the middle of the screen. Therefore, offset is 0px.
	 * 
	 * If the image is at the top, it's -100% away from the middle, 20*-100% = -20...
	 * the image should be offset 20px up.
	 * 
	 * The max slide distance is determined by calculating the difference in the cropped view size (circle)
	 * and the size of the uncropped image (85px in our case). That's how much larger the image is than it's
	 * container (30px). We divide by 2 to get the max slide distance for either direction (15px).
	 */
	var parent_height; // How tall is the window (ScrollView, in our case)
	var parent_center; // Where is the middle of the window (ScrollView, in our case)
	var row_height = 85; // How tall is our wrapper for the image (row)
	var image_height = 85; // How tall is the image we're using
	var movement_bounds = 15; // How much should the image move up or down, maximum
}

var events = [];
var upvote_notice;
var current_date = Moment().format("YYYY-MM-DD");

function init() {
	getData();
	
	var DateSlider = Alloy.createController("ui/dateSlider");
	
	DateSlider.on("dateChange", onDateChange);
	
	$.DateSlider.add(DateSlider.getView());
}

function getData() {
	var anim = Ti.UI.createAnimation({
		opacity: 0,
		duration: 100
	});
	
	anim.addEventListener("complete", function() {
		Forekast.getEventByDate({
			date: current_date,
			success: setData,
			failure: function() {
				$.Events.animate({
					opacity: 1,
					duration: 100
				});
			}
		});
	});
	
	$.Events.animate(anim);
}

function setData(_data) {
	$.Events.removeAllChildren();
	
	events = [];
	
	var eventCount = 0;
	
	if(_data.length > 0) {
		for(var i = 0, x = _data.length; i < x; i++) {
			var event = _data[i];
			var eventDatetime = Moment(event.local_date + " " + event.local_time, "YYYY-MM-DD h:mm A");
			
			// Ignore if not today
			if(event.local_date !== current_date) {
				continue;
			}
			
			// Ignore if already over (+2 hours since start)
			if(!event.is_all_day && eventDatetime.diff(Moment(), "hours") < -2) {
				continue;
			}
			
			if(event.local_date == current_date) {
				var controller = Alloy.createController("ui/event_row", {
					id: event._id
				});
				
				controller.updateViews({
					"#Row": {
						backgroundColor: (eventCount % 2 == 0) ? "#FFF" : "#F6F6F6"
					},
					"#Container": {
						backgroundColor: (eventCount % 2 == 0) ? "#FFF" : "#F6F6F6"
					},
					"#Title": {
						text: event.name
					},
					"#Time": {
						text: event.is_all_day ? "All Day" : event.local_time
					},
					"#Subkast": {
						text: Forekast.getSubkastByAbbrev(event.subkast)
					},
					"#UpvoteCount": {
						text: event.upvotes
					},
					"#Image": {
						image: event.mediumUrl
					},
					"#ImageOverlay": {
						image: (eventCount % 2 == 0) ? "images/circle_white.png" : "images/circle_grey.png"
					}
				});
				
				if(OS_IOS) {
					events.push(controller);
				}
				
				$.Events.add(controller.getView());
				
				eventCount++;
			}
		}
		
		if(OS_IOS) {
			calculateParallax();
		}
	} else {
		var noEvents = Ti.UI.createLabel({
			text: "No events on this date",
			color: "#7A7F9E",
			font: {
				fontSize: 14,
				fontFamily: Alloy.CFG.Font.Medium
			},
			textAlign: "center",
			height: Ti.UI.FILL
		});
		
		$.Events.add(noEvents);
	}
	
	$.Events.animate({
		opacity: 1,
		duration: 100
	});
}

function onDateChange(_event) {
	if(_event.date != current_date) {
		current_date = _event.date;
		
		getData();
	}
}

function openSettings() {
	var SettingsWindow = Alloy.createController("settings").getView();
	
	SettingsWindow.open();
}

/*
// TODO: v1.1
$.Events.addEventListener("remind", function(_event) {
	if(!upvote_notice) {
		upvote_notice = Alloy.createController("ui/upvote");
		
		$.ListWindow.add(upvote_notice.getView());
	}
	
	upvote_notice.show();
	
	App.logEvent("Event:Upvote", {
		eventId: _event.id
	});
});
*/

$.ListWindow.addEventListener("open", function() {
	var anim = Ti.UI.createAnimation({
		opacity: 0,
		duration: 500
	});
	
	anim.addEventListener("complete", function() {
		$.ListWindow.remove($.Overlay);
	});
	
	$.Overlay.animate(anim);
	
	init();
	
	// TODO: v1.1
	// App.Push.register();
	
	// TODO: Remove this platform switch, it's temporary
	if(OS_IOS) {
		if(!ENV_DEV) {
			if(!Ti.App.Properties.getBool("WelcomeShown", false)) {
				var WelcomeWindow = Alloy.createController("ui/welcome").getView();
				
				WelcomeWindow.open();
			}
		}
	}
});

if(OS_IOS) {
	$.Events.addEventListener("postlayout", function postLayoutListener(_event) {
		parent_height = _event.source.rect.height;
		parent_center = parent_height / 2;
		
		$.Events.removeEventListener("postlayout", postLayoutListener);
	});
	
	$.Events.addEventListener("scroll", calculateParallax);
	
	function calculateParallax(_event) {
		// How far down the screen have we scrolled?
		var offset_y = _event && _event.source.contentOffset.y ? _event.source.contentOffset.y : 0;
		
		for(var i = 0, x = events.length; i < x; i++) {
			var event = events[i];
			
			// Where on the Y-axis is our element
			var position_y = (0 - offset_y) + (i * row_height) + (row_height / 2);
			var percent_y;
			
			// Is it above or below the middle of the screen?
			if(position_y > parent_center) {
				// Below; calculate percentage away from center (bottom of screen is 100%, middle is 0%)
				percent_y = ((position_y / parent_center) - 1);
			} else if(position_y < parent_center) {
				// Above; calculate percentage away from center (top of screen is 100%, middle is 0%)
				percent_y = (0 - (1 - (position_y / parent_center)));
			}
			
			// New position is a percentage of the maximum slide amount
			var new_y = movement_bounds * percent_y;
			
			// Ensure that we don't go over the maximum slide amount
			if(new_y > 0 && new_y > movement_bounds) {
				new_y = movement_bounds;
			} else if(new_y < 0 && new_y < (0 - movement_bounds)) {
				new_y = 0 - movement_bounds;
			}
			
			event.updateViews({
				"#Image": {
					top: new_y
				}
			});
		}
	}
}

if(OS_ANDROID) {
	$.ListWindow.open();
}
