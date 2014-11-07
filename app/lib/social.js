var Moment = require("alloy/moment");

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
	 * @param {String} _event The event to share
	 * @param {Object} _view [iOS only] The view to attach the OptionDialog to (required for iPad)
	 */
	share: function(_event, _view) {
		if(OS_IOS) {
			if(Social.activitySupported) {
				Social.shareActivityView(_event, _view);
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
							Social.twitter(_event);
							break;
						case "email":
							Social.email(_event);
							break;
						case "browser":
							Ti.Platform.openURL(_event.url);
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

			intent.putExtra(Ti.Android.EXTRA_TEXT, Social.format(_event));

			Ti.Android.currentActivity.startActivity(intent);
		}
	},
	/**
	 * Formats event information for social sharing
	 * @param {Object} _event Event information to format into a post
	 * @param {Boolean} _trim Whether to trim the title
	 */
	format: function(_event, _trim) {
		var title = "",
			now = Moment(),
			count = 144 - 28 - 11; // Max Tweet - Short URL (+5) as of 11/07/14 - Forekast hashtag

		if(_event.time.diff(now, "hours") < 1) {
			title += "Now: ";
		} else if(_event.time.format("YYMMDD") == now.format("YYMMDD")) {
			title += "At " + _event.time.format("h:mma"); + ": ";
		} else if(_event.time.format("YYMMDD") == now.clone().add(1, "days").format("YYMMDD")) {
			title += "Tomorrow: ";
		} else {
			title += _event.time.format("MMM Do") + ": ";
		}

		if(_trim) {
			count -= title.length;

			title += _event.title.substring(0, count);
		} else {
			title += _event.title;
		}

		title += " #Forekast ";
		title += _event.url;

		return title;
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
	 * @param {String} _event The event to share
	 * @platform iOS
	 */
	Social.email = function(_event) {
		if(Social.emailSupported) {
			var email = Ti.UI.createEmailDialog({
				html: false,
				subject: "Check out this event on Forekast",
				messageBody: Social.format(_event, false)
			});

			email.open();
		}
	};

	/**
	 * Shares information via Twitter
	 * @param {String} _event The event to share
	 * @platform iOS
	 */
	Social.twitter = function(_event) {
		if(Social.twitterSupported) {
			module.twitter({
				text: Social.format(_event, true),
				url: _event.url
			});
		}
	};

	/**
	 * Opens the sharing menu for iOS 6+ users
	 * @param {String} _event The event to share
	 * @param {Object} _view The view to attach the OptionDialog to (required for iPad)
	 * @platform iOS
	 */
	Social.shareActivityView = function(_event, _view) {
		if(OS_IOS && Alloy.isTablet) {
			module.activityPopover({
				text: Social.format(_event, true),
				removeIcons: "print,copy,contact,camera,weibo",
				view: _view
			});
		} else {
			module.activityView({
				text: Social.format(_event, true),
				removeIcons: "print,copy,contact,camera,weibo"
			});
		}
	};
}

module.exports = Social;