/**
 * Caching functions class
 * @class Cache
 */
var Moment = require("alloy/moment");

var directory = Ti.Filesystem.applicationCacheDirectory;

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

exports.available = function(_url) {
	var fileName = _url.replace(/[^\w\d]/g, "");
	var file = Ti.Filesystem.getFile(directory, fileName);

	if(file.exists()) {
		return true;
	} else {
		return false;
	}
};

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

exports.write = function(_url, _data) {
	var fileName = _url.replace(/[^\w\d]/g, "");
	var file = Ti.Filesystem.getFile(directory, fileName);
	var data = JSON.stringify(_data);
	
	if(file.write(data) === false) {
		Ti.API.error("Could not write to local cache");
	}

	file = null;
};