var args = arguments[0] || {};

function init() {
	$.Author.text = args.author;
	$.Text.text = args.comment;
}

init();