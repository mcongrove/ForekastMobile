var Moment = require("alloy/moment"),
	http = require("http");

var apiUrl = "https://staging.forekast.com/api/1/";

/*
 * Gets events for a specific date
 * @param {String} _params.date The date in YYYY-MM-DD format
 * @param {Function} _params.success The success callback
 * @param {Function} _params.failure The error callback
 */
exports.getEventsByDate = function(_params) {
	if(!Alloy.CFG.StaticDemo) {
		var url = apiUrl + "events?country=" + Ti.Locale.getCurrentCountry() + "&time_zone=America/Chicago&on_date=" + Moment(_params.date).format("YYYY-MM-DD");

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
};

/*
 * Gets a specific event
 * @param {String} _params.id The ID of the event
 * @param {Function} _params.success The success callback
 * @param {Function} _params.failure The error callback
 */
exports.getEventById = function(_params) {
	if(!Alloy.CFG.StaticDemo) {
		var url = apiUrl + "events/" + _params.id;

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
	var url = apiUrl + "events/" + _params.id + "/comments";

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
		displayTime,
		displayRelativeTime,
		reminderTime,
		reminderText;

	if(_event.eastern_tv_show) {
		displayTime = _event.eastern_tv_time;
		displayRelativeTime = datetime.fromNow();
	} else if(_event.is_all_day) {
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

	if(_event.is_all_day) {
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
		if(_event.id == "53fdeedf666b773aaf030000") {
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