// App bootstrap
var App = require("core"),
	Moment = require("alloy/moment"),
	Forekast = require("model/forekast");

function animate() {
	var transAstronautStart = Ti.UI.create2DMatrix({
		rotate: 89
	});

	var transAstronautEnd = Ti.UI.create2DMatrix({
		rotate: 271
	});

	var animFadeIn = Ti.UI.createAnimation({
		opacity: 1,
		duration: 1000
	});

	var animAstronaut = Ti.UI.createAnimation({
		right: (App.Device.width + 150),
		transform: transAstronautEnd,
		curve: Ti.UI.ANIMATION_CURVE_LINEAR,
		duration: 3500,
		delay: 1000
	});

	animAstronaut.addEventListener("complete", complete);

	$.Astronaut.setTransform(transAstronautStart);
	$.Background.animate(animFadeIn);
	$.Forekast.animate(animFadeIn);
	$.Astronaut.animate(animAstronaut);
}

function complete() {
	var animBackground = Ti.UI.createAnimation({
		backgroundColor: "#FFF",
		duration: 500
	});

	var animFadeOut = Ti.UI.createAnimation({
		opacity: 0,
		duration: 500
	});

	animBackground.addEventListener("complete", close);

	$.SplashWindow.animate(animBackground);
	$.Background.animate(animFadeOut);
	$.Forekast.animate(animFadeOut);
}

function close() {
	App.MainWindow.open();

	$.SplashWindow.close();
}

if(ENV_DEV) {
	$.SplashWindow.addEventListener("open", close);
} else {
	$.SplashWindow.addEventListener("open", animate);
}

$.SplashWindow.open();

Forekast.getEventsByDate({
	date: Moment().format("YYYY-MM-DD")
});