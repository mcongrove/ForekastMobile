var Moment = require("alloy/moment"),
	http = require("http");

/*
 * Gets events for a specific date
 * @param {String} _params.date The date in YYYY-MM-DD format
 * @param {Function} _params.success The success callback
 * @param {Function} _params.error The error callback
 */
exports.getEventByDate = function(_params) {
	var url = "https://forekast.com/api/events/eventsByDate.json?"
			+ "&subkasts[]=TV"
			+ "&subkasts[]=TVM"
			+ "&subkasts[]=SE"
			+ "&subkasts[]=ST"
			+ "&subkasts[]=TE"
			+ "&subkasts[]=HAW"
			+ "&subkasts[]=PRP"
			+ "&subkasts[]=HA"
			+ "&subkasts[]=EDU"
			+ "&subkasts[]=MA"
			+ "&subkasts[]=ART"
			+ "&subkasts[]=GM"
			+ "&subkasts[]=OTH"
			+ "&country=" + Ti.Locale.getCurrentCountry()
			+ "&datetime=" + _params.date + " 00:00:00"
			+ "&zone_offset=" + Moment().zone()
	;
	
	http.request({
		url: url,
		type: "GET",
		format: "JSON",
		success: _params.success,
		error: _params.error
	});
};

/*
 * Gets a specific event
 * @param {String} _params.id The ID of the event
 * @param {Function} _params.success The success callback
 * @param {Function} _params.error The error callback
 */
exports.getEventById = function(_params) {
	var url = "https://forekast.com/events/"
			+ _params.id
			+ ".json"
	;
	
	http.request({
		url: url,
		type: "GET",
		format: "JSON",
		success: _params.success,
		error: _params.error
	});
};

/*
 * Gets comments for a specific event
 * @param {String} _params.id The ID of the event
 * @param {Function} _params.success The success callback
 * @param {Function} _params.error The error callback
 */
exports.getCommentsByEventId = function(_params) {
	var url = "https://forekast.com/api/events/"
			+ _params.id
			+ "/comments.json?skip=0"
	;
	
	http.request({
		url: url,
		type: "GET",
		format: "JSON",
		success: _params.success,
		error: _params.error
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