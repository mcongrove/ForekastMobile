// App bootstrap
var App = require("core"),
	Moment = require("alloy/moment");

var args = arguments[0] || {};

var itemWidth = (App.Device.width / 2);
var itemEmptyWidth = (itemWidth / 2);
var dateStart = Moment(),
	dateEnd = Moment().add(1, "months"),
	dateDiff = dateEnd.diff(dateStart, "days");

function init() {
	var empty = Ti.UI.createView({
		height: 44,
		width: itemEmptyWidth
	});
	
	$.DateSlider.add(empty);
	
	for(var i = 0, x = dateDiff; i < x; i++) {
		var text;
		
		if(i == 0) {
			text = "Today";
		} else if(i == 1) {
			text = "Tomorrow";
		} else {
			text = dateStart.add(1, "days").format("MMM Do");
		}
		
		var item = Ti.UI.createView({
			width: itemWidth,
			height: 44
		});
		
		var label = Ti.UI.createLabel({
			width: Ti.UI.FILL,
			height: 44,
			textAlign: "center",
			color: i == 0 ? "#4ED5C3" : "#6E7690",
			font: {
				fontSize: 14,
				fontFamily: "HelveticaNeue-Bold"
			},
			text: text
		});
		
		item.add(label);
		
		$.DateSlider.add(item);
	}
	
	$.DateSlider.add(empty);
}

init();