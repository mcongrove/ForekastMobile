/**
 * Social sharing library
 * 
 * @singleton
 * @class social
 */
var Social = {
	/**
	 * Opens the sharing menu
	 * 
	 * **NOTE: Minimum iOS 6 for ActivityView, otherwise fall back to Twitter and e-mail**
	 * @param {String} _url The URL to share
	 * @param {Object} _view [iOS only] The view to attach the OptionDialog to (required for iPad)
	 */
	share: function(_url, _view) {
		if(OS_IOS) {
			if(Social.activitySupported) {
				Social.shareActivityView(_url, _view);
			} else {
				var options = [];
				var mapping = [];

				if(Social.twitterSupported) {
					options.push("Share via Twitter");
					mapping.push("twitter");
				}

				if(Social.emailSupported) {
					options.push("Share via E-Mail");
					mapping.push("email");
				}

				options.push("Open in Safari");
				mapping.push("browser");

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
							Social.twitter(_url);
							break;
						case "email":
							Social.email(_url);
							break;
						case "browser":
							Ti.Platform.openURL(_url);
							break;
					}
				});

				if(_view === undefined) {
					dialog.show();
				} else {
					dialog.show({
						view: _view
					});
				}
			}
		} else if(OS_ANDROID) {
			var intent = Ti.Android.createIntent({
				action: Ti.Android.ACTION_SEND,
				type: "text/plain"
			});

			intent.putExtra(Ti.Android.EXTRA_TEXT, "Check out this event on Forekast " + _url);

			Ti.Android.currentActivity.startActivity(intent);
		}
	}
};

if(OS_IOS) {
	var module = require("dk.napp.social");

	/**
	 * If Twitter is supported by the device
	 * @property {Boolean}
	 * @readonly
	 * @platform iOS
	 */
	Social.twitterSupported = module.isTwitterSupported();

	/**
	 * If e-mail is supported by the device
	 * @property {Boolean}
	 * @readonly
	 * @platform iOS
	 */
	Social.emailSupported = Ti.UI.createEmailDialog().isSupported();

	/**
	 * If ActivityView is supported by the device
	 * @property {Boolean}
	 * @readonly
	 * @platform iOS
	 */
	Social.activitySupported = module.isActivityViewSupported();

	/**
	 * Shares information via e-mail
	 * @param {String} _url The URL to share
	 * @platform iOS
	 */
	Social.email = function(_url) {
		if(Social.emailSupported) {
			var email = Ti.UI.createEmailDialog();

			email.html = true;
			email.messageBody = "Check out this event on Forekast<br /><br /><a href='" + _url + "'>" + _url + "</a>";

			email.open();
		}
	};

	/**
	 * Shares information via Twitter
	 * @param {String} _url The URL to share
	 * @platform iOS
	 */
	Social.twitter = function(_url) {
		if(Social.twitterSupported) {
			module.twitter({
				text: "Check out this event on Forekast",
				url: _url
			});
		}
	};

	/**
	 * Opens the sharing menu for iOS 6+ users
	 * @param {String} _url The URL to share
	 * @param {Object} _view The view to attach the OptionDialog to (required for iPad)
	 * @platform iOS
	 */
	Social.shareActivityView = function(_url, _view) {
		if(OS_IOS && Alloy.isTablet) {
			module.activityPopover({
				text: "Check out this event on Forekast " + _url,
				removeIcons: "print,copy,contact,camera,weibo",
				view: _view
			});
		} else {
			module.activityView({
				text: "Check out this event on Forekast " + _url,
				removeIcons: "print,copy,contact,camera,weibo"
			});
		}
	};
}

module.exports = Social;