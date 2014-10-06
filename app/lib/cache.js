/**
 * HTTP request caching class
 * 
 * @class cache
 * @uses alloy/moment
 */
var Moment = require("alloy/moment");

var directory = Ti.Filesystem.applicationCacheDirectory;

/**
 * Checks if the URL request has a valid (warm) cache item
 * @param {Object} _url The URL to check
 * @return {Boolean} Whether the URL has a warm cache item
 */
exports.valid = function(_url) {
	var fileName = _url.replace(/[^\w\d]/g, "");
	var file = Ti.Filesystem.getFile(directory, fileName);

	if(file.exists()) {
		var modifiedTime = Moment(file.modificationTimestamp());
		var difference = Moment().diff(modifiedTime, "minutes");

		if(isNaN(difference) || difference > Alloy.CFG.CacheDuration) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
};

/**
 * Checks if the URL request has any available (warm or cold) cache item
 * @param {Object} _url The URL to check
 * @return {Boolean} Whether the URL has a cache item
 */
exports.available = function(_url) {
	var fileName = _url.replace(/[^\w\d]/g, "");
	var file = Ti.Filesystem.getFile(directory, fileName);

	if(file.exists()) {
		return true;
	} else {
		return false;
	}
};

/**
 * Reads from a URL request cache item
 * @param {Object} _url The URL of the cache item to retrieve
 * @return {String} The file data
 */
exports.read = function(_url) {
	var fileName = _url.replace(/[^\w\d]/g, "");
	var file = Ti.Filesystem.getFile(directory, fileName);

	if(file.exists()) {
		var data = file.read();
	} else {
		return false;
	}

	return JSON.parse(data);
};

/**
 * Writes to a URL request cache item
 * @param {Object} _url The URL of the cache item to store
 * @param {Object} _data The data to cache
 */
exports.write = function(_url, _data) {
	var fileName = _url.replace(/[^\w\d]/g, "");
	var file = Ti.Filesystem.getFile(directory, fileName);
	var data = JSON.stringify(_data);

	if(file.write(data) === false) {
		Ti.API.error("Could not write to local cache");
	}

	file = null;
};