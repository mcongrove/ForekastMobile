var Moment = require("alloy/moment"),
	Notify = require("bencoding.localnotify");

exports.setReminder = function(_params) {
	Notify.scheduleLocalNotification({
		alertBody: "In 1 Hour: " + _params.name,
		alertAction: "Show Event",
		userInfo: {
			eventId: _params.id,
			eventName: _params.name
		},
		date: _params.datetime.subtract(1, "hours").toDate()
		//date: Moment().add(5, "seconds").toDate()
	});
};

exports.cancelReminder = function(_eventId) {
	Notify.cancelLocalNotificationByKey(_eventId, "eventId");
};

exports.isReminderSet = function(_eventId) {
	var notifications = Notify.findLocalNotificationsByKey(_eventId, "eventId");

	if(notifications.scheduledCount > 0) {
		return true;
	} else {
		return false;
	}
};