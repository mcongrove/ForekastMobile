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

var events = [],
	upvote_notice,
	current_date = Moment().format("YYYY-MM-DD"),
	dateSlider,
	eventTabletOpened = false;

function init() {
	$.LoadingIndicator.start();

	getData();

	Ti.App.Properties.setString("GenerationDate", Moment().format("YYYY-MM-DD"));

	dateSlider = Alloy.createController("ui/dateSlider");

	dateSlider.on("dateChange", onDateChange);

	$.DateSlider.add(dateSlider.getView());
}

function checkReset() {
	current_date = Moment().format("YYYY-MM-DD");

	var generationDate = Ti.App.Properties.getString("GenerationDate", current_date);

	if(generationDate !== current_date) {
		getData();

		Ti.App.Properties.setString("GenerationDate", current_date);

		dateSlider = Alloy.createController("ui/dateSlider");

		dateSlider.on("dateChange", onDateChange);

		$.DateSlider.removeAllChildren();
		$.DateSlider.add(dateSlider.getView());
	}
}

function getData() {
	var anim = Ti.UI.createAnimation({
		opacity: 0,
		duration: 100
	});

	anim.addEventListener("complete", function() {
		Forekast.getEventsByDate({
			date: current_date,
			success: setData,
			failure: setData
		});
	});

	$.Events.animate(anim);
}

function setData(_data) {
	$.Events.removeAllChildren();

	events = [];

	var eventCount = 0;

	if(_data && _data.length > 0) {
		for(var i = 0, x = _data.length; i < x; i++) {
			var event = Forekast.calculateTimes(_data[i]);

			// Ensure event is happening today
			if(event.time.datetime.format("YYYY-MM-DD") !== current_date) {
				if(event.is_all_day && event.local_date == current_date) {
					// Weird edge-case; datetime is wrong, but local time is today
				} else {
					if(!Alloy.CFG.StaticDemo) {
						continue;
					}
				}
			}

			var controller = Alloy.createController("ui/event_row", {
				event_id: event._id
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
					text: event.time.display.time
				},
				"#Subkast": {
					text: Forekast.getSubkastByAbbrev(event.subkast)
				},
				"#UpvoteCount": {
					text: event.upvotes
				},
				"#Image": {
					image: event.width == 0 ? "/images/empty.png" : event.mediumUrl
				},
				"#ImageOverlay": {
					image: (eventCount % 2 == 0) ? "/images/circle_white.png" : "/images/circle_grey.png"
				}
			});

			if(OS_IOS) {
				events.push(controller);
			}

			$.Events.add(controller.getView());

			eventCount++;

			if(OS_IOS && Alloy.isTablet && !eventTabletOpened) {
				var eventWindow = Alloy.createController("event", {
					event_id: event._id
				}).getView();

				App.DetailWindow.openWindow(eventWindow);

				eventTabletOpened = true;
			}
		}

		if(OS_IOS) {
			if(eventCount > 0) {
				calculateParallax();
			}
		}
	}

	if(eventCount == 0) {
		var noEvents = Ti.UI.createLabel({
			text: "No events on this date",
			color: "#7A7F9E",
			font: {
				fontSize: 14,
				fontFamily: Alloy.CFG.Font.Medium,
				fontWeight: "medium"
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

function goToCurrentDay() {
	current_date = Moment().format("YYYY-MM-DD");

	dateSlider.DateSlider.scrollToView(0);

	getData();
}

function goToNextDay() {
	if(dateSlider.DateSlider.currentPage < dateSlider.DateSlider.views.length - 1) {
		dateSlider.DateSlider.moveNext();
		current_date = Moment(current_date, "YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD");

		getData();
	}
}

function goToPreviousDay() {
	if(dateSlider.DateSlider.currentPage > 0) {
		dateSlider.DateSlider.movePrevious();
		current_date = Moment(current_date, "YYYY-MM-DD").subtract(1, "days").format("YYYY-MM-DD");

		getData();
	}
}

if(OS_ANDROID) {
	$.SliderIndicatorLeft.addEventListener("click", function() {
		goToPreviousDay();
	});

	$.SliderIndicatorRight.addEventListener("click", function() {
		goToNextDay();
	});
}

$.Events.addEventListener("swipe", function(_event) {
	if(_event.direction == "left") {
		goToNextDay();
	} else if(_event.direction == "right") {
		goToPreviousDay();
	}
});

/*
// TODO: v1.2
$.Events.addEventListener("remind", function(_event) {
	if(!upvote_notice) {
		upvote_notice = Alloy.createController("ui/upvote");
		
		$.ListWindow.add(upvote_notice.getView());
	}
	
	upvote_notice.show();
	
	App.logEvent("Event:Upvote", {
		eventId: _event.event_id
	});
});
*/

if(OS_IOS) {
	$.Events.addEventListener("postlayout", function postLayoutListener(_event) {
		$.Events.removeEventListener("postlayout", postLayoutListener);

		parent_height = _event.source.rect.height;
		parent_center = parent_height / 2;
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
					top: new_y,
					opacity: 1
				}
			});
		}
	}
}

Ti.App.addEventListener("resumed", checkReset);

$.ListWindow.addEventListener("open", function() {
	if(OS_ANDROID) {
		$.ListWindow.activity.addEventListener("resume", function(_event) {
			Ti.App.fireEvent("resumed");
		});

		$.ListWindow.activity.addEventListener("pause", function(_event) {
			Ti.App.fireEvent("pause");
		});
	}

	var anim = Ti.UI.createAnimation({
		opacity: 0,
		duration: 500
	});

	anim.addEventListener("complete", function() {
		$.ListWindow.remove($.Overlay);
	});

	$.Overlay.animate(anim);

	init();

	// TODO: v1.2
	// App.Push.register();
});

if(OS_ANDROID) {
	$.ListWindow.open();
}