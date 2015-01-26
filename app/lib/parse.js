var Alloy = require("alloy"),
	http = require("http");

/**
 * Parse.com REST library
 * 
 * @singleton
 * @class parse
 * @uses http
 */
var Parse = {
	/**
	 * Application ID
	 * @property {String}
	 * @private
	 */
	applicationId: Alloy.CFG.Parse.ApplicationId,
	/**
	 * REST Key
	 * @property {String}
	 * @private
	 */
	restKey: Alloy.CFG.Parse.RestKey,
	/**
	 * Default endpoint
	 * @property {String}
	 * @private
	 */
	url: "https://api.parse.com/1/",
	/**
	 * Update a specific installation object
	 * @param {String} _id ID of object to save
	 * @param {Object} _params The parameters to save to the object
	 * @param {Function} _callback The success and error callback
	 */
	updateInstallation: function(_id, _params, _callback) {
		var headers = [
			{
			name: "X-Parse-Application-Id",
			value: Parse.applicationId
		},
			{
			name: "X-Parse-REST-API-Key",
			value: Parse.restKey
		}
];

		http.request({
			doNotCache: true,
			type: "PUT",
			format: "json",
			data: JSON.stringify(_params),
			url: Parse.url + "installations/" + _id,
			headers: headers,
			success: function(_response) {
				if(_callback) {
					_callback({
						success: _response
					});
				}
			},
			failure: function(_error) {
				if(_callback) {
					_callback({
						failure: _error
					});
				}
			}
		});
	},
	/**
	 * Get an installation object by ID
	 * @param {String} _id The ID of the object
	 * @param {Function} _callback The success and error callback
	 */
	getInstallation: function(_id, _callback) {
		var headers = [
			{
			name: "X-Parse-Application-Id",
			value: Parse.applicationId
		},
			{
			name: "X-Parse-REST-API-Key",
			value: Parse.restKey
		}
];

		http.request({
			doNotCache: true,
			type: "GET",
			format: "json",
			url: Parse.url + "installations/" + _id,
			headers: headers,
			success: function(_response) {
				if(_callback) {
					_callback({
						success: _response
					});
				}
			},
			failure: function(_error) {
				if(_callback) {
					_callback({
						failure: _error
					});
				}
			}
		});
	},
	/**
	 * Register device for push
	 * @param {String} _token The token of the device
	 * @param {Array} _channels Channels to register the device for
	 * @param {Function} _callback The success and error callback
	 */
	registerDeviceToken: function(_token, _channels, _callback) {
		var headers = [
			{
			name: "X-Parse-Application-Id",
			value: Parse.applicationId
		},
			{
			name: "X-Parse-REST-API-Key",
			value: Parse.restKey
		}
];

		var data = {
			deviceType: OS_IOS ? "ios" : "android",
			deviceToken: _token,
			channels: _channels ? _channels : [""]
		};

		http.request({
			doNotCache: true,
			type: "POST",
			format: "json",
			data: JSON.stringify(data),
			url: Parse.url + "installations",
			headers: headers,
			success: function(_response) {
				/**
				 * @member TitaniumProperties
				 * @property {String} installationObjectId
				 */
				Ti.App.Properties.setString("InstallationObjectId", _response.objectId);

				if(_callback) {
					_callback({
						success: _response
					});
				}
			},
			failure: function(_error) {
				if(_callback) {
					_callback({
						failure: _error
					});
				}
			}
		});
	},
	/**
	 * Log an event
	 * @param {String} _name The name of the event
	 * @param {Object} _data The data to log
	 * @param {Function} _callback The success and error callback
	 */
	event: function(_name, _data, _callback) {
		var headers = [
			{
			name: "X-Parse-Application-Id",
			value: Parse.applicationId
		},
			{
			name: "X-Parse-REST-API-Key",
			value: Parse.restKey
		}
];

		var payload = {
			doNotCache: true,
			type: "POST",
			format: "json",
			url: Parse.url + "events/" + _name.replace(" ", ""),
			headers: headers,
			success: function(_response) {
				if(_callback) {
					_callback({
						success: _response
					});
				}
			},
			failure: function(_error) {
				Ti.API.error("Error: " + _error);

				if(_callback) {
					_callback({
						failure: _error
					});
				}
			}
		};

		if(!_data) {
			_data = {};
		}

		_data.os = OS_IOS ? "ios" : "android";

		payload.data = JSON.stringify({
			dimensions: _data
		});

		http.request(payload);
	}
};

Ti.App.addEventListener("Push:TokenReceived", function(_event) {
	Parse.registerDeviceToken(_event.deviceToken);
});

module.exports = Parse;