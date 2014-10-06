/**
 * Push notification library
 * 
 * @singleton
 * @class push
 */
var Push = {
	/*
	 * The device push token
	 * @property {String}
	 * @readonly
	 */
	pushDeviceToken: Ti.App.Properties.getString("PushDeviceToken", null),
	/**
	 * Registers the device for push notifications
	 */
	register: function() {
		if(OS_IOS) {
			if(!Push.pushDeviceToken) {
				if(parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
					/**
					 * Push registration
					 * @ignore
					 */
					function registerForPush() {
						Ti.Network.registerForPushNotifications({
							success: Push.deviceTokenSuccess,
							error: Push.deviceTokenError,
							callback: Push.receiveNotification
						});

						Ti.App.iOS.removeEventListener("usernotificationsettings", registerForPush);
					}

					Ti.App.iOS.addEventListener("usernotificationsettings", registerForPush);

					Ti.App.iOS.registerUserNotificationSettings({
						types: [
							Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
							Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
							Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
						]
					});
				} else {
					Ti.Network.registerForPushNotifications({
						types: [
							Ti.Network.NOTIFICATION_TYPE_BADGE,
							Ti.Network.NOTIFICATION_TYPE_ALERT,
							Ti.Network.NOTIFICATION_TYPE_SOUND
						],
						success: Push.deviceTokenSuccess,
						error: Push.deviceTokenError,
						callback: Push.receiveNotification
					});
				}
			}
		} else {

		}
	},
	/**
	 * The event that fires after retrieving the device token
	 * @param {Object} _event Standard Titanium callback event
	 */
	deviceTokenSuccess: function(_event) {
		Push.pushDeviceToken = _event.deviceToken;

		Ti.App.Properties.setString("PushDeviceToken", Push.pushDeviceToken);

		Ti.App.fireEvent("Push:TokenReceived", {
			deviceToken: Push.pushDeviceToken
		});
	},
	/**
	 * The event that fires after failing to retrieve the device token
	 * @param {Object} _event Standard Titanium callback event
	 */
	deviceTokenError: function(_event) {
		Ti.API.error("Device token could not be retrieved");

		Ti.API.error(JSON.stringify(_event.error));
	},
	/**
	 * The event that fires after receiving a push notification
	 * @param {Object} _event Standard Titanium callback event
	 */
	receiveNotification: function(_event) {
		Ti.API.warn("PUSH RECEIVED");
		Ti.API.error(JSON.stringify(_event));

		var payload = null;

		if(_event.data) {
			payload = _event.data;
		} else if(_event.payload) {
			payload = JSON.parse(_event.payload);
			payload.alert = payload.android.alert;
		} else {
			return;
		}
	}
};

module.exports = Push;

// Parse Form:
// { "aps": { "alert": "In 1 hour: Watch the Atlast V rocket..." } }
//
// App Received:
// {"code":0,"data":{"aps":{"alert":"Notice!"},"alert":"Notice!"},"type":"remote","source":{},"inBackground":true,"success":true}