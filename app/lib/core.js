var Alloy = require("alloy");

/**
 * The main app singleton used throughout the app. This singleton
 * can manage your navigation flow, special events that happen throughout
 * the app lifecycle, etc.
 *
 * It's important to understand that this should mainly be a simple app singleton
 * for managing global things throughout your app, i.e. if you want to sanitize
 * some html, you shouldn't put a function to handle that here.
 *
 * @class core
 * @singleton
 */
var App = {
	/**
	 * Device information, some come from the Ti API calls and can be referenced
	 * from here so multiple bridge calls aren't necessary, others generated here
	 * for ease of calculations and such.
	 *
	 * @property {Object}
	 * @param {String} version The version of the OS
	 * @param {Number} versionMajor The major version of the OS
	 * @param {Number} versionMinor The minor version of the OS
	 * @param {Number} width The width of the device screen
	 * @param {Number} height The height of the device screen
	 * @param {Number} dpi The DPI of the device screen
	 * @param {String} orientation The device orientation, either "landscape" or "portrait"
	 * @readonly
	 */
	Device: {
		version: Ti.Platform.version,
		versionMajor: parseInt(Ti.Platform.version.split(".")[0], 10),
		versionMinor: parseInt(Ti.Platform.version.split(".")[1], 10),
		width: null,
		height: null,
		dpi: Ti.Platform.displayCaps.dpi,
		orientation: Ti.Gesture.orientation == Ti.UI.LANDSCAPE_LEFT || Ti.Gesture.orientation == Ti.UI.LANDSCAPE_RIGHT ? "landscape" : "portrait"
	},
	/**
	 * Parse module for analytics and push notifications
	 * @type {Class}
	 */
	Parse: require("parse"),
	/**
	 * Push notifications library
	 * @type {Class}
	 */
	// TODO: v1.2
	// Push: require("push"),
	/**
	 * Accessor for the main window
	 * @property {Object}
	 */
	MainWindow: null,
	/**
	 * Accessor for the master window (tablet only)
	 * @property {Object}
	 */
	MasterWindow: null,
	/**
	 * Accessor for the detail window (tablet only)
	 * @property {Object}
	 */
	DetailWindow: null,
	/**
	 * The currently opened event ID
	 * @property {String}
	 */
	EventId: null,
	/**
	 * Sets up the app singleton and all it's child dependencies.
	 * **NOTE: This should only be fired in index controller file and only once.**
	 */
	init: function() {
		// Global system Events
		Ti.Network.addEventListener("change", App.networkChange);
		Ti.App.addEventListener("pause", App.exit);
		Ti.App.addEventListener("close", App.exit);
		Ti.App.addEventListener("resumed", App.resume);
		Ti.Gesture.addEventListener("orientationchange", App.orientationChange);

		if(OS_IOS) {
			Ti.App.iOS.addEventListener("notification", App.notification);
		}

		// Log app open event
		App.logEvent("Application:Open");

		// Get device dimensions
		App.getDeviceDimensions();

		// Register for notification alerts
		if(OS_IOS) {
			if(App.Device.versionMajor >= 8) {
				Ti.App.iOS.registerUserNotificationSettings({
					types: [
						Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
						Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
						Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
					]
				});
			}
		}
	},
	/**
	 * Opens the settings screen
	 */
	openSettings: function() {
		var SettingsWindow = Alloy.createController("settings").getView();

		if(OS_IOS && Alloy.isTablet) {
			App.MasterWindow.openWindow(SettingsWindow);
		} else {
			SettingsWindow.open();
		}
	},
	/**
	 * Notification event observer
	 * @param {Object} _notification Standard Titanium callback event
	 */
	notification: function(_notification) {
		if(_notification.userInfo.eventId) {
			var dialog = Ti.UI.createAlertDialog({
				title: "Open Event?",
				message: _notification.userInfo.eventName,
				buttonNames: ["Yes", "No"],
				cancel: 1
			});

			dialog.addEventListener("click", function(_event) {
				if(_event.index === 0) {
					var eventWindow = Alloy.createController("event", {
						event_id: _notification.userInfo.eventId
					}).getView();

					if(Alloy.isHandheld) {
						eventWindow.rightNavButton = Ti.UI.createButton({
							title: "Done"
						});

						var win = Ti.UI.iOS.createNavigationWindow({
							window: eventWindow,
							modal: true
						});

						eventWindow.rightNavButton.addEventListener("click", function() {
							win.close();
						});

						win.open();
					} else {
						App.DetailWindow.openWindow(eventWindow);
					}
				}
			});

			dialog.show();
		}
	},
	/**
	 * Network change event observer
	 * @param {Object} _event Standard Titanium callback event
	 */
	networkChange: function(_event) {

	},
	/**
	 * Exit event observer
	 * @param {Object} _event Standard Titanium callback event
	 */
	exit: function(_event) {

	},
	/**
	 * Resume event observer
	 * @param {Object} _event Standard Titanium callback event
	 */
	resume: function(_event) {

	},
	/**
	 * Orientation change event observer
	 * @param {Object} _event Standard Titanium callback event
	 */
	orientationChange: function(_event) {
		// Ignore face-up, face-down and unknown orientation
		if(_event.orientation === Titanium.UI.FACE_UP || _event.orientation === Titanium.UI.FACE_DOWN || _event.orientation === Titanium.UI.UNKNOWN) {
			return;
		}

		App.Device.orientation = _event.source.isLandscape() ? "landscape" : "portrait";

		/**
		 * Fires an event for orientation change handling throughout the app
		 * @event OrientationChange
		 */
		Ti.App.fireEvent("OrientationChange", {
			orientation: App.Device.orientation
		});
	},
	/**
	 * Determines the device dimensions
	 * @return {Object} Returns the new values of the new {@link core.Device.width} & {@link core.Device.height} settings
	 */
	getDeviceDimensions: function() {
		// Set device height and width based on orientation
		switch(App.Device.orientation) {
			case "portrait":
				App.Device.width = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth;
				App.Device.height = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight;
				break;
			case "landscape":
				App.Device.width = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformWidth : Ti.Platform.displayCaps.platformHeight;
				App.Device.height = Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? Ti.Platform.displayCaps.platformHeight : Ti.Platform.displayCaps.platformWidth;
				break;
		}

		// Convert dimensions from DP to PX for Android
		if(OS_ANDROID) {
			App.Device.width = (App.Device.width / (App.Device.dpi / 160));
			App.Device.height = (App.Device.height / (App.Device.dpi / 160));
		}

		return {
			width: App.Device.width,
			height: App.Device.height
		};
	},
	/**
	 * Logs an analytics event
	 */
	logEvent: function(_name, _properties) {
		if(!ENV_DEV) {
			App.Parse.event(_name, _properties);
		}
	}
};

module.exports = App;