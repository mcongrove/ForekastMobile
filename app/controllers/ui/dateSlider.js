// App bootstrap
var App = require("core"),
	Moment = require("alloy/moment");

var args = arguments[0] || {};

var deviceWidth = Alloy.isTablet && OS_IOS ? 320 : App.Device.width;
var itemWidth = (deviceWidth / 2);

var date = Moment(),
	dateEnd = Moment().add(1, "months"),
	dateDiff = dateEnd.diff(date, "days"),
	selectedView;

function init() {
	if(OS_IOS) {
		$.DateSlider.width = itemWidth;

		$.DateSlider.hitRect = {
			width: deviceWidth,
			height: 44,
			x: (0 - (deviceWidth / 4)),
			y: 0
		};
	}

	for(var i = 0, x = dateDiff; i < x; i++) {
		var text;

		if(i == 0) {
			text = "Today";
		} else if(i == 1) {
			text = "Tomorrow";
		} else {
			text = date.format("MMM Do");
		}

		var item = Ti.UI.createView({
			top: 0,
			width: itemWidth,
			height: 44
		});

		if(i == 0) {
			selectedView = item;
		}

		var label = Ti.UI.createLabel({
			width: Ti.UI.FILL,
			height: 44,
			textAlign: "center",
			color: i == 0 ? Alloy.CFG.Color.Bright : "#6E7690",
			font: {
				fontSize: 14,
				fontFamily: Alloy.CFG.Font.Bold,
				fontWeight: "bold"
			},
			text: text,
			touchEnabled: false
		});

		item.add(label);

		$.DateSlider.addView(item);

		date.add(1, "days");
	}
}

$.DateSlider.addEventListener("scrollend", function(_event) {
	$.trigger("dateChange", {
		date: Moment().add(_event.currentPage, "days").format("YYYY-MM-DD")
	});

	var children = $.DateSlider.getViews();
	selectedView.children[0].setColor("#6E7690");
	selectedView = children[_event.currentPage];
	selectedView.children[0].setColor(Alloy.CFG.Color.Bright);
});

init();