var Mailgun = require("mailgun");

function submitForm() {
	var message = "From: " + $.FieldName.value + "\n"
				+ "Email: " + $.FieldEmail.value + "\n"
				+ "Twitter: " + $.FieldTwitter.value + "\n"
				+ "Message: " + $.FieldMessage.value + "\n"
	;
	
	Mailgun.sendMail({
		message: message,
		success: onSuccess,
		failure: onError
	});
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

$.Submit.addEventListener("click", submitForm);