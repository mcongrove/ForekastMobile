if(OS_IOS) {
	var SOCIAL = require("dk.napp.social");

	/**
	 * If Twitter is supported by the device
	 * @platform iOS
	 */
	exports.twitterSupported = SOCIAL.isTwitterSupported();

	/**
	 * If e-mail is supported by the device
	 * @platform iOS
	 */
	exports.emailSupported = Ti.UI.createEmailDialog().isSupported();

	/**
	 * If ActivityView is supported by the device
	 * @platform iOS
	 */
	exports.activitySupported = SOCIAL.isActivityViewSupported();

	/**
	 * Shares information via e-mail
	 * @platform iOS
	 */
	exports.email = function() {
		if(exports.emailSupported) {
			var email = Ti.UI.createEmailDialog();

			email.html = true;
			email.messageBody = "Check out this great app I found called BiteBook; it's a simple fish logger, and even supports the Pebble Smartwatch!<br /><br /><a href='http://www.bitebook.net'>BiteBook.net</a>";

			email.open();
		}
	};

	/**
	 * Shares information via Twitter
	 * @platform iOS
	 */
	exports.twitter = function() {
		if(exports.twitterSupported) {
			SOCIAL.twitter({
				text: "Check out this great app I found called BiteBook; it's a simple fish logger, and even supports the Pebble Smartwatch!",
				url: "http://www.bitebook.net"
			});
		}
	};

	/**
	 * Opens the sharing menu for iOS 6+ users
	 * @platform iOS
	 */
	exports.shareActivityView = function() {
		SOCIAL.activityView({
			text: "Check out this great app I found called BiteBook; it's a simple fish logger, and even supports the Pebble Smartwatch! BiteBook.net",
			removeIcons: "print,copy,contact,camera,weibo"
		});
	};
}

/**
 * Opens the sharing menu
 * 
 * **NOTE: Minimum iOS 6 for ActivityView, otherwise fall back to Twitter and e-mail**
 */
exports.share = function() {
	if(OS_IOS) {
		if(exports.activitySupported) {
			exports.shareActivityView();
		} else {
			var options = [];
			var mapping = [];

			if(exports.twitterSupported) {
				options.push("Share via Twitter");
				mapping.push("twitter");
			}

			if(exports.emailSupported) {
				options.push("Share via E-Mail");
				mapping.push("email");
			}

			options.push("Cancel");
			mapping.push("cancel");

			var dialog = Ti.UI.createOptionDialog({
				options: options,
				cancel: options.length - 1,
				selectedIndex: options.length - 1
			});

			dialog.addEventListener("click", function(_event) {
				switch(mapping[_event.index]) {
					case "twitter":
						exports.twitter();
						break;
					case "email":
						exports.email();
						break;
				}
			});

			dialog.show();
		}
	} else if(OS_ANDROID) {
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "text/plain"
		});

		intent.putExtra(Ti.Android.EXTRA_TEXT, "Check out this great app I found called BiteBook; it's a simple fish logger, and even supports the Pebble Smartwatch! BiteBook.net");

		Ti.Android.currentActivity.startActivity(intent);
	}
};