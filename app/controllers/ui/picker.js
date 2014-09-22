var callback;

$.setOptions = function(_data) {
	var rows = [];

	for(var i = 0, x = _data.length; i < x; i++) {
		var bgColor = _data[i].selected ? "#AA3E4252" : "99000000";

		var row = Ti.UI.createTableViewRow({
			title: _data[i].title,
			value: _data[i].value,
			height: 48,
			backgroundColor: bgColor,
			selectedBackgroundColor: "#99000000",
			backgroundSelectedColor: "#99000000",
			backgroundFocusedColor: "#99000000",
			color: "#FFF",
		});

		rows.push(row);
	}

	$.Table.setData(rows);
};

$.setInstructions = function(_text) {
	$.Instructions.text = _text;
};

$.setCallback = function(_callback) {
	callback = _callback;
};

$.open = function() {
	var animation = Ti.UI.createAnimation({
		opacity: 1,
		duration: 250
	});

	animation.addEventListener("complete", function onComplete() {
		$.Wrapper.opacity = 1;

		animation.removeEventListener("complete", onComplete);
	});

	$.Wrapper.animate(animation);
};

$.close = function(_callback) {
	var animation = Ti.UI.createAnimation({
		opacity: 0,
		duration: 250
	});

	animation.addEventListener("complete", function onComplete() {
		$.Wrapper.opacity = 0;

		_callback();

		animation.removeEventListener("complete", onComplete);
	});

	$.Wrapper.animate(animation);
};

$.Wrapper.addEventListener("click", function(_event) {
	$.close(callback(false));
});

$.Table.addEventListener("click", function(_event) {
	$.close(function() {
		callback(_event.rowData.value);
	});
});