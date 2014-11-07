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
	 * Normalizes an event ID
	 */
	eventId: function(_eventId) {
		if(OS_ANDROID) {
			return _eventId.match(/\d+/g).join("").substring(0, 5);
		} else {
			return _eventId;
		}
	},
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
			var eventId = Reminder.eventId(_params.id);

			Manager.addAlarmNotification({
				requestCode: eventId,
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

			var db = Ti.Database.open("Forekast");

			db.execute("INSERT INTO reminder (id) VALUES (?);", eventId);

			db.close();
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
			var eventId = Reminder.eventId(_eventId);

			Manager.cancelAlarmNotification(eventId);

			var db = Ti.Database.open("Forekast");

			db.execute("DELETE FROM reminder WHERE id = ?;", eventId);

			db.close();
		}
	},
	/**
	 * Cancels all reminders
	 * @platform iOS
	 */
	cancelAllReminders: function() {
		if(OS_IOS) {
			Manager.cancelAllLocalNotifications();
		} else if(OS_ANDROID) {
			var db = Ti.Database.open("Forekast");

			var data = db.execute("SELECT id FROM reminder;");

			while(data.isValidRow()) {
				Reminder.cancelReminder(data.fieldByName("id"));

				data.next();
			}

			data.close();
			db.close();
		}
	},
	/**
	 * Checks if a reminder is set for an event
	 * @param {Object} _eventId The ID of the event
	 */
	isReminderSet: function(_eventId) {
		if(OS_IOS) {
			var notifications = Manager.findLocalNotificationsByKey(_eventId, "eventId");

			if(notifications.scheduledCount > 0) {
				return true;
			} else {
				return false;
			}
		} else if(OS_ANDROID) {
			var eventId = Reminder.eventId(_eventId);

			var db = Ti.Database.open("Forekast");

			var data = db.execute("SELECT id FROM reminder WHERE id = ?;", eventId),
				isSet = false;

			if(data.rowCount > 0) {
				isSet = true;
			}

			data.close();
			db.close();

			return isSet;
		}
	},
	/**
	 * Creates the database to be used for tracking reminders (Android-only)
	 */
	setupDatabase: function() {
		var db = Ti.Database.open("Forekast");

		db.execute("CREATE TABLE IF NOT EXISTS reminder (id TEXT PRIMARY KEY);");

		db.close();
	}
};

if(OS_ANDROID) {
	Reminder.setupDatabase();
}

module.exports = Reminder;