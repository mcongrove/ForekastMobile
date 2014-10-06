var Alloy = require("alloy"),
	http = require("http");

/**
 * Mailgun REST library
 * 
 * @singleton
 * @class mailgun
 * @uses http
 */
var Mailgun = {
	/*
	 * The URL for the Mailgun API
	 * @property {String}
	 * @private
	 */
	url: "https://api:" + Alloy.CFG.Mailgun.RestKey + "@api.mailgun.net/v2/" + Alloy.CFG.Mailgun.Domain + "/messages",
	/**
	 * Sends an e-mail through the Mailgun API
	 * @param {Object} _params
	 * @param {String} _params.message The message to send
	 * @param {Function} _params.success The success callback
	 * @param {Function} _params.failure The failure callback
	 */
	sendMail: function(_params) {
		http.request({
			type: "POST",
			format: "JSON",
			url: Mailgun.url,
			data: {
				from: "Forekast Mobile <postmaster@mg.mattcongrove.com>",
				to: "Matthew Congrove <me@mattcongrove.com>",
				subject: "Forekast Mobile Feedback",
				text: _params.message,
			},
			success: _params.success ? _params.success : null,
			failure: _params.failure ? _params.failure : null
		});
	}
};

module.exports = Mailgun;