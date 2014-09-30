/**
 * Mailgun REST library
 * @singleton
 * @class Mailgun
 * @uses alloy
 * @uses http
 */
var Alloy = require("alloy"),
	http = require("http");

var Mailgun = {
	url: "https://api:" + Alloy.CFG.Mailgun.RestKey + "@api.mailgun.net/v2/" + Alloy.CFG.Mailgun.Domain + "/messages",
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
			error: _params.error ? _params.error : null
		});
	}
};

module.exports = Mailgun;