var Moment = require("alloy/moment"),
	http = require("http");

/*
 * Gets events for a specific date
 * @param {String} _params.date The date in YYYY-MM-DD format
 * @param {Function} _params.success The success callback
 * @param {Function} _params.failure The error callback
 */
exports.getEventsByDate = function(_params) {
	var url = "https://forekast.com/api/events/eventsByDate.json?" + "&subkasts[]=TV" + "&subkasts[]=TVM" + "&subkasts[]=SE" + "&subkasts[]=ST" + "&subkasts[]=TE" + "&subkasts[]=HAW" + "&subkasts[]=PRP" + "&subkasts[]=HA" + "&subkasts[]=EDU" + "&subkasts[]=MA" + "&subkasts[]=ART" + "&subkasts[]=GM" + "&subkasts[]=OTH" + "&country=" + Ti.Locale.getCurrentCountry() + "&datetime=" + _params.date + " 00:00:00" + "&zone_offset=" + Moment().zone();

	// Use this data for screenshots
	/*
	url: "http://www.mattcongrove.com/forekast/events.php",
	forceFresh: true,
	doNotCache: true,
	*/

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
	var url = "https://forekast.com/events/" + _params.id + ".json";

	// Use this data for screenshots
	/*
	url: "http://www.mattcongrove.com/forekast/event.php",
	forceFresh: true,
	doNotCache: true,
	*/

	http.request({
		url: url,
		type: "GET",
		format: "JSON",
		success: _params.success,
		failure: _params.failure
	});
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

	return _event;
};