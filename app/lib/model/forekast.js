var Moment = require("alloy/moment"),
	http = require("http");

/*
 * Gets events for a specific date
 * @param {String} _params.date The date in YYYY-MM-DD format
 * @param {Function} _params.success The success callback
 * @param {Function} _params.failure The error callback
 */
exports.getEventsByDate = function(_params) {
	if(!Alloy.CFG.StaticDemo) {
		var url = "https://forekast.com/api/events/eventsByDate.json?" + "&subkasts[]=TV" + "&subkasts[]=TVM" + "&subkasts[]=SE" + "&subkasts[]=ST" + "&subkasts[]=TE" + "&subkasts[]=HAW" + "&subkasts[]=PRP" + "&subkasts[]=HA" + "&subkasts[]=EDU" + "&subkasts[]=MA" + "&subkasts[]=ART" + "&subkasts[]=GM" + "&subkasts[]=OTH" + "&country=" + Ti.Locale.getCurrentCountry() + "&datetime=" + _params.date + " 00:00:00" + "&zone_offset=" + Moment().zone();

		http.request({
			url: url,
			type: "GET",
			format: "JSON",
			success: _params.success,
			failure: _params.failure
		});
	} else {
		var url = "http://www.mattcongrove.com/forekast/events.php";

		http.request({
			url: url,
			forceFresh: true,
			doNotCache: true,
			type: "GET",
			format: "JSON",
			success: _params.success,
			failure: _params.failure
		});
	}

	http.request({
		url: url,
		type: "GET",
		format: "JSON",
		success: _params.success,
		failure: _params.failure
	});
};

/*
 * Gets a specific event
 * @param {String} _params.id The ID of the event
 * @param {Function} _params.success The success callback
 * @param {Function} _params.failure The error callback
 */
exports.getEventById = function(_params) {
	if(!Alloy.CFG.StaticDemo) {
		var url = "https://forekast.com/events/" + _params.id + ".json";

		http.request({
			url: url,
			type: "GET",
			format: "JSON",
			success: _params.success,
			failure: _params.failure
		});
	} else {
		var url = "http://www.mattcongrove.com/forekast/event.php";

		http.request({
			url: url,
			forceFresh: true,
			doNotCache: true,
			type: "GET",
			format: "JSON",
			success: _params.success,
			failure: _params.failure
		});
	}
};

/*
 * Gets comments for a specific event
 * @param {String} _params.id The ID of the event
 * @param {Function} _params.success The success callback
 * @param {Function} _params.failure The error callback
 */
exports.getCommentsByEventId = function(_params) {
	var url = "https://forekast.com/api/events/" + _params.id + "/comments.json?skip=0";

	http.request({
		url: url,
		type: "GET",
		format: "JSON",
		success: _params.success,
		failure: _params.failure
	});
};

/**
 * Gets the human-readable name of a subkast from it's abbreviation
 * @param {Object} _abbrev The subkast abbreviation
 */
exports.getSubkastByAbbrev = function(_abbrev) {
	var subkast = "";

	switch(_abbrev) {
		case "TV":
			subkast = "TV";
			break;
		case "TVM":
			subkast = "Movies";
			break;
		case "SE":
			subkast = "Sports";
			break;
		case "ST":
			subkast = "Science";
			break;
		case "TE":
			subkast = "Technology";
			break;
		case "HAW":
			subkast = "How About We";
			break;
		case "PRP":
			subkast = "Product Release";
			break;
		case "HA":
			subkast = "Holidays";
			break;
		case "EDU":
			subkast = "Education";
			break;
		case "MA":
			subkast = "Music";
			break;
		case "ART":
			subkast = "Arts";
			break;
		case "GM":
			subkast = "Gaming";
			break;
		default:
			subkast = "Other";
			break;
	}

	return subkast;
};

/**
 * Performs some time calculations
 * @param {Object} _event The event
 */
exports.calculateTimes = function(_event) {
	var datetime = Moment(_event.datetime),
		now = Moment(),
		userOffset = now.zone(),
		displayTime,
		displayRelativeTime,
		reminderTime,
		reminderText;

	if(_event.time_format == "tv_show") {
		var hour = _event.local_time.split(":")[0],
			isDST = Moment(_event.local_date).isDST(),
			eastOffset,
			westOffset;

		displayTime = hour + "/" + (parseInt(hour, 10) - 1) + "c";

		if(isDST) {
			eastOffset = "-0400";
			westOffset = 360;
		} else {
			eastOffset = "-0500";
			westOffset = 420;
		}

		datetime = Moment(_event.local_date + " " + _event.local_time + " " + eastOffset, "YYYY-MM-DD h:mm A Z");

		if(userOffset >= westOffset) {
			datetime = datetime.subtract(2, "hours");
		}

		displayRelativeTime = datetime.fromNow();
	} else if(_event.is_all_day) {
		datetime = Moment(_event.datetime.split("T")[0] + " 12:00", "YYYY-MM-DD HH:mm");

		displayTime = "All Day";
		displayRelativeTime = "";
	} else {
		displayTime = datetime.format("h:mma");
		displayRelativeTime = datetime.fromNow();
	}

	_event.time = {
		datetime: datetime,
		display: {
			date: datetime.format("MMMM Do"),
			time: displayTime,
			relative: displayRelativeTime
		},
		daysAhead: datetime.diff(now, "days")
	};

	if(_event.time_format == "tv_show") {
		if(datetime.diff(now, "hours") < 2) {
			reminderTime = datetime;
			reminderText = "Happening Now";
		} else {
			reminderTime = datetime.clone().subtract(1, "hours");
			reminderText = "In 1 Hour";
		}
	} else if(_event.is_all_day) {
		reminderTime = datetime.clone().subtract(1, "days").hour(21);
		reminderText = "Tomorrow";
	} else {
		if(datetime.diff(now, "hours") < 2) {
			reminderTime = datetime;
			reminderText = "Happening Now";
		} else {
			reminderTime = datetime.clone().subtract(1, "hours");
			reminderText = "In 1 Hour";
		}
	}

	_event.reminder = {
		available: (datetime.diff(now, "minutes") < 10) ? false : true,
		time: reminderTime,
		text: reminderText
	};

	if(Alloy.CFG.StaticDemo) {
		if(_event._id == "53fdeedf666b773aaf030000") {
			_event.time = {
				datetime: datetime,
				display: {
					date: "Today",
					time: "6:02pm",
					relative: "in 5 hours"
				},
				daysAhead: datetime.diff(now, "days")
			};
		} else {
			_event.time.display.date = "Today";
		}

		_event.reminder = {
			available: true,
			time: Moment().add(1, "minute"),
			text: "In 1 Hour"
		};
	}

	return _event;
};

/**
 * Performs some image size calculations
 * @param {Object} _image The image size
 * @param {Number} _image.width The image width
 * @param {Number} _image.height The image height
 * @param {Number} _view The width of the container view
 */
exports.calculateImageFill = function(_image, _view) {
	var height = null;

	if(!_image.width || !_image.height) {
		return false;
	}

	if(_image.width > _image.height) {
		// Landscape
		height = ((_image.height / _image.width) * _view);
	} else if(_image.height > _image.width) {
		// Portrait
		height = ((_image.height / _image.width) * _view);
	} else if(_image.width == _image.height) {
		// Square
		height = _view;
	} else {
		// Edge case
		height = (0.75 * _view);
	}

	return Math.round(height);
};