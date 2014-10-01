exports.show = function() {
	var transformLarge = Ti.UI.create2DMatrix({
		scale: 1
	});

	var transformSmall = Ti.UI.create2DMatrix({
		scale: 0.5
	});

	var animViewFadeIn = Ti.UI.createAnimation({
		opacity: 1,
		duration: 100
	});

	var animModalFadeIn = Ti.UI.createAnimation({
		opacity: 1,
		transform: transformSmall,
		duration: 750
	});

	var animViewFadeOut = Ti.UI.createAnimation({
		opacity: 0,
		duration: 500,
		delay: 250
	});

	animViewFadeIn.addEventListener("complete", function() {
		$.UpvoteView.animate(animViewFadeOut);
		$.Container.animate(animModalFadeIn);
	});

	$.Container.setTransform(transformLarge);

	$.UpvoteView.animate(animViewFadeIn);
};