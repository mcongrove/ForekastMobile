var Moment = require("alloy/moment"),
	Manager = OS_IOS ? require("bencoding.localnotify") : require("bencoding.alarmmanager").createAlarmManager();

/**
 * Local notification reminders library
 * 
 * @singleton
 * @class reminder
 */
var Reminder = {
	/**
	 * Sets a reminder
	 * @param {Object} _params
	 * @param {String} _params.id The ID of the event
	 * @param {Object} _params.time The datetime object of the event
	 * @param {String} _params.name The name of the event
	 * @param {String} _params.text The reminder text (e.g. "In 1 Hour", "Happening Now")
	 */
	setReminder: function(_params) {
		var datetime = _params.time.toDate();

		if(OS_IOS) {
			Manager.scheduleLocalNotification({
				alertBody: _params.text + ": " + _params.name,
				alertAction: "Show Event",
				userInfo: {
					eventId: _params.id,
					eventName: _params.name
				},
				date: datetime
			});
		} else {
			Manager.addAlarmNotification({
				requestCode: _params.id.match(/\d+/g).join("").substring(0, 5),
				year: datetime.getFullYear(),
				month: datetime.getMonth(),
				day: datetime.getDate(),
				hour: datetime.getHours(),
				minute: datetime.getMinutes(),
				contentTitle: _params.text + ":",
				contentText: _params.name,
				icon: Ti.App.Android.R.drawable.appicon,
				showLights: true,
				playSound: true
			});
		}
	},
	/**
	 * Cancels a reminder
	 * @param {Object} _eventId The ID of the event to cancel
	 */
	cancelReminder: function(_eventId) {
		if(OS_IOS) {
			Manager.cancelLocalNotificationByKey(_eventId, "eventId");
		} else {
			Manager.cancelAlarmNotification(_eventId.match(/\d+/g).join("").substring(0, 5));
		}
	},
	/**
	 * Cancels all reminders
	 * @platform iOS
	 */
	cancelAllReminders: function() {
		if(OS_IOS) {
			Manager.cancelAllLocalNotifications();
		}
	},
	/**
	 * Checks if a reminder is set for an event
	 * @param {Object} _eventId The ID of the event
	 */
	isReminderSet: function(_eventId) {
		var notifications = Manager.findLocalNotificationsByKey(_eventId, "eventId");

		if(notifications.scheduledCount > 0) {
			return true;
		} else {
			return false;
		}
	}
};

module.exports = Reminder;