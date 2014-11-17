var Mailgun = require("mailgun");

function submitForm() {
	if($.FieldMessage.value.length > 0) {
		var message = "From: " + $.FieldName.value + "\n" + "Email: " + $.FieldEmail.value + "\n" + "Twitter: " + $.FieldTwitter.value + "\n" + "Message: " + $.FieldMessage.value + "\n";

		Mailgun.sendMail({
			message: message,
			success: onSuccess,
			failure: onError
		});
	} else {
		var dialog = Ti.UI.createAlertDialog({
			title: "Missing Fields",
			message: "Please fill out the comments field with your feedback.",
			ok: "OK"
		});

		dialog.show();
	}
}

function onSuccess() {
	var dialog = Ti.UI.createAlertDialog({
		title: "Thank You!",
		message: "We've received your feedback",
		ok: "OK"
	});

	dialog.addEventListener("click", function() {
		$.SettingsFeedbackWindow.close();
	});

	dialog.show();
}

function onError() {
	var dialog = Ti.UI.createAlertDialog({
		title: "Message Send Failure",
		message: "We weren't able to send your message",
		ok: "Try Again"
	});

	dialog.show();
}

function closeWindow() {
	$.SettingsFeedbackWindow.close();
}

$.Submit.addEventListener("click", submitForm);