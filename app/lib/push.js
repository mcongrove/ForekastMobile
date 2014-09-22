exports.pushDeviceToken = Ti.App.Properties.getString("PushDeviceToken", null);

/**
 * Registers the device for push notifications
 */
exports.register = function() {
	if(OS_IOS) {
		if(!exports.pushDeviceToken) {
			if(parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
				function registerForPush() {
					Ti.Network.registerForPushNotifications({
						success: deviceTokenSuccess,
						error: deviceTokenError,
						callback: receiveNotification
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
					success: deviceTokenSuccess,
					error: deviceTokenError,
					callback: receiveNotification
				});
			}
		}
	} else {
		
	}
};

function deviceTokenSuccess(_event) {
	exports.pushDeviceToken = _event.deviceToken;
	
	Ti.App.Properties.setString("PushDeviceToken", exports.pushDeviceToken);

	Ti.App.fireEvent("Push:TokenReceived", {
		deviceToken: exports.pushDeviceToken
	});
}

function deviceTokenError(_event) {
	Ti.API.error("Device token could not be retrieved");
	
	Ti.API.error(JSON.stringify(_event.error));
}

function receiveNotification(_event) {
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


// Parse Form:
// { "aps": { "alert": "In 1 hour: Watch the Atlast V rocket..." } }
//
// App Received:
// {"code":0,"data":{"aps":{"alert":"Notice!"},"alert":"Notice!"},"type":"remote","source":{},"inBackground":true,"success":true}