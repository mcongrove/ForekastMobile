var TEST_DATA = [
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/540b/075c/666b/774b/1ebd/0000/medium/open-uri20140906-19230-iztbwt?1410807001" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/5412/f45a/666b/7750/fc75/0000/medium/open-uri20140912-20732-cp4469?1410804276" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/5416/736f/666b/7776/da1a/0000/medium/fight-for-your-right.png?1410757486" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/5415/9529/666b/7750/fca3/0000/medium/open-uri20140914-20732-12omidv?1410714096" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/5410/ea55/666b/7750/fc4d/0000/medium/open-uri20140915-30426-1uf8ggn?1410804283" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/5410/eab7/666b/773d/7dc3/0000/medium/Screen_Shot_2014-09-10_at_7.17.09_PM.png?1410507474" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/5416/55c7/666b/7776/da15/0000/medium/stringio.txt?1410788781" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/53ef/ac92/666b/7778/3303/0000/medium/POTC-4-stills-pirates-of-the-caribbean-4-22224905-1500-994.jpg?1410451797" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/53fd/eedf/666b/773a/af03/0000/medium/open-uri20140827-15023-1rfhcmd?1410767350" },
	{ title: "Watch the Atlas V rocket launch streaming live", time: "4:44pm", subkast: "Science", upvotes: 24, image: "https://s3.amazonaws.com/FK-PROD/events/images/5407/42f9/666b/7703/36af/0100/medium/2014_LoneStarLeMans_620x250.jpg?1409778464" }
];

// App bootstrap
var App = require("core");

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

var events = [];
var upvote_notice;

function init() {
	for(var i = 0, x = TEST_DATA.length; i < x; i++) {
		var event = TEST_DATA[i];
		var controller = Alloy.createController("ui/event_row");
		
		controller.updateViews({
			"#Row": {
				backgroundColor: (i % 2 == 0) ? "#FFF" : "#F6F6F6"
			},
			"#Title": {
				text: event.title
			},
			"#Time": {
				text: event.time
			},
			"#Subkast": {
				text: event.subkast
			},
			"#UpvoteCount": {
				text: event.upvotes
			},
			"#Image": {
				image: event.image
			},
			"#ImageOverlay": {
				image: (i % 2 == 0) ? "images/circle_white.png" : "images/circle_grey.png"
			}
		});
		
		events.push(controller);
		
		$.Events.add(controller.getView());
	}
	
	calculateParallax();
	
	$.DateSlider.add(Alloy.createController("ui/dateSlider").getView());
}

function openSettings() {
	var SettingsWindow = Alloy.createController("settings").getView();
	
	SettingsWindow.open();
}

$.Events.addEventListener("click", function() {
	var event = Alloy.createController("event");
});

$.Events.addEventListener("swipe", function() {
	if(!upvote_notice) {
		upvote_notice = Alloy.createController("ui/upvote");
		
		$.ListWindow.add(upvote_notice.getView());
	}
	
	upvote_notice.show();
	
	App.logEvent("Event:Upvote", {
		eventId: 12345
	});
});

$.ListWindow.addEventListener("open", function() {
	$.Overlay.animate({
		opacity: 0,
		duration: 500
	});
	
	init();
});

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