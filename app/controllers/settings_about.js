var StyledLabel = require("ti.styledlabel");

var label = StyledLabel.createLabel({
	height: Ti.UI.SIZE,
	top: 0,
	right: 20,
	bottom: 20,
	left: 20,
	html: "<style type='text/css'>body {font-family: 'HelveticaNeue-Thin', 'Helvetica Neue Thin', 'HelveticaNeue', Helvetica, Arial, sans-serif;font-size: 14px;color: #3E4252;}a {color: #3CA395; text-decoration: none;}p {margin: 20px 0 0;}</style><p>This application developed and designed by <a href='http://www.mattcongrove.com'>Matthew Congrove</a>. Contributions provided by Chris Bowley.</p>"
});

label.addEventListener("click", function(_event) {
	if(_event.url) {
		Ti.Platform.openURL(_event.url);
	}
});

$.SettingsAboutWindow.add(label);