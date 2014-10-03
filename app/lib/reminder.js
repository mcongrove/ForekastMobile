var Moment = require("alloy/moment"),
	Manager = OS_IOS ? require("bencoding.localnotify") : require("bencoding.alarmmanager").createAlarmManager();

exports.setReminder = function(_params) {
	var datetime = _params.time.toDate();

	/*
	if(_params.atStart) {
		datetime = Moment().add(1, "minutes").toDate();
	} else {
		datetime = Moment().add(1, "seconds").toDate();
	}
	*/

	if(OS_IOS) {
		Manager.scheduleLocalNotification({
			alertBody: _params.text + ": ",
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
};

exports.cancelReminder = function(_eventId) {
	if(OS_IOS) {
		Manager.cancelLocalNotificationByKey(_eventId, "eventId");
	} else {
		Manager.cancelAlarmNotification(_eventId.match(/\d+/g).join("").substring(0, 5));
	}
};

exports.isReminderSet = function(_eventId) {
	var notifications = Manager.findLocalNotificationsByKey(_eventId, "eventId");

	if(notifications.scheduledCount > 0) {
		return true;
	} else {
		return false;
	}
};