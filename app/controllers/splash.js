// App bootstrap
var App = require("core");

function animate() {
	var transAstronautStart = Ti.UI.create2DMatrix({
		rotate: 90
	});
	
	var transAstronautEnd = Ti.UI.create2DMatrix({
		rotate: 270
	});
	
	var animStars = Ti.UI.createAnimation({
		opacity: 1,
		duration: 500
	});
	
	var animAstronaut = Ti.UI.createAnimation({
		right: (App.Device.width + 150),
		transform: transAstronautEnd,
		curve: Ti.UI.ANIMATION_CURVE_LINEAR,
		duration: 3500
	});
	
	animAstronaut.addEventListener("complete", complete);
	
	$.Astronaut.setTransform(transAstronautStart);
	$.Background.animate(animStars);
	$.Astronaut.animate(animAstronaut);
}

function complete() {
	var animBackground = Ti.UI.createAnimation({
		backgroundColor: "#FFF",
		duration: 500
	});
	
	var animStars = Ti.UI.createAnimation({
		opacity: 0,
		duration: 500
	});
	
	animBackground.addEventListener("complete", close);
	
	$.SplashWindow.animate(animBackground);
	$.Background.animate(animStars);
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