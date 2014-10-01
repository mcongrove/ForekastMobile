var text = "<p>This application developed and designed by <a href='http://www.mattcongrove.com'><strong>Matthew Congrove</strong></a>. Contributions provided by Chris Bowley and Rick Blalock.</p><p>This application is <strong>not</strong> owned or maintained by Forekast.</p><p>Forekast, the astronaut logo, and data used with permission of Forekast, Inc. Special thanks to the entire Forekast team for creating an amazing service and letting this app be created.</p><p>This application stores anonymized credentials to interact with the Forekast service. Your username, e-mail address, password and other identifiable information is <strong>not</strong> stored. Anonymized usage data is tracked for the purpose of analytics, specifically to improve this application and monitor performance, and is stored by a secure 3rd-party analytics service. The analytics data may be shared with Forekast, but no other 3rd-party without prior notice. This application may request and attempt to use location data to improve the service, specifically for localizing the time of events to your current timezone. There is no advertising in this application, and we do not share your personal information with any advertising companies. Information you submit through the feedback form may be retained to improve this application.</p><p>The above information is subject to change. If any material changes are made, we will provide a prominent notice in this application or our app store listings.</p>";

if(OS_IOS) {
	var StyledLabel = require("ti.styledlabel");

	var style = "<style type='text/css'>body {font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'HelveticaNeue', Helvetica, Arial, sans-serif;font-size: 14px;color: #3E4252;}a {color: #3CA395; text-decoration: none;}p {margin: 20px 0 0;}</style>";

	var label = StyledLabel.createLabel({
		height: Ti.UI.SIZE,
		top: 0,
		right: 20,
		bottom: 20,
		left: 20,
		html: style + text
	});

	label.addEventListener("click", function(_event) {
		if(_event.url) {
			Ti.Platform.openURL(_event.url);
		}
	});
} else {
	var label = Ti.UI.createLabel({
		height: Ti.UI.SIZE,
		top: 20,
		right: 20,
		bottom: 0,
		left: 20,
		color: "#3E4252",
		html: text
	});
}

$.ScrollView.add(label);