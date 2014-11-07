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
			height: 74,
			x: (0 - (deviceWidth / 4)),
			y: 0
		};
	}

	for(var i = 0, x = dateDiff; i < x; i++) {
		var dateText, dayText;

		if(i == 0) {
			dateText = "Today";
		} else if(i == 1) {
			dateText = "Tomorrow";
		} else {
			dateText = date.format("MMM Do");
		}

		dayText = date.format("dddd");

		var item = Ti.UI.createView({
			top: 0,
			width: itemWidth,
			height: 74
		});

		if(i == 0) {
			selectedView = item;
		}

		var labelDate = Ti.UI.createLabel({
			width: Ti.UI.FILL,
			height: 44,
			top: 0,
			textAlign: "center",
			color: i == 0 ? Alloy.CFG.Color.Bright : "#6E7690",
			font: {
				fontSize: 14,
				fontFamily: Alloy.CFG.Font.Bold,
				fontWeight: "bold"
			},
			text: dateText,
			touchEnabled: false
		});

		var labelDay = Ti.UI.createLabel({
			width: Ti.UI.FILL,
			height: 30,
			top: 44,
			textAlign: "center",
			color: "#6E7690",
			font: {
				fontSize: 12,
				fontFamily: Alloy.CFG.Font.Bold,
				fontWeight: "bold"
			},
			text: dayText,
			touchEnabled: false
		});

		item.add(labelDate);
		item.add(labelDay);

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