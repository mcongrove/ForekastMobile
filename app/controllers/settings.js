// App bootstrap
var App = require("core"),
	Social = require("social");

var OPTIONS = [
	{
		title: "Sign out",
		action: function() {
			
		}
	},
	{
		title: "Event reminder settings",
		action: function() {
			
		}
	},
	{
		title: "About this app",
		controller: "settings_about"
	},
	{
		title: "Contact developer",
		action: function() {
			var email = Ti.UI.createEmailDialog({
				barColor: "#FFF"
			});
		
			email.toRecipients = [ "me@mattcongrove.com" ];
			email.subject = "Forekast Mobile";
			email.messageBody = "";
			email.open();
		}
	}
];

function init() {
	var rows = [];
	
	for(var i = 0, x = OPTIONS.length; i < x; i++) {
		var row = Alloy.createController("settings_row", { title: OPTIONS[i].title }).getView();
		
		if(i % 2 == 0) {
			row.backgroundColor = "#FFF";
		}
		
		if(OPTIONS[i].controller) {
			row.controller = OPTIONS[i].controller;
			
			row.addEventListener("click", function(_event) {
				var detail = Alloy.createController(_event.row.controller).getView();
				
				if(OS_IOS) {
					$.NavWindow.openWindow(detail);
				} else {
					detail.open();
				}
			});
		} else if(OPTIONS[i].action) {
			row.addEventListener("click", OPTIONS[i].action);
			
			row.remove(row.children[1]);
		}
		
		rows.push(row);
	}
	
	$.Table.setData(rows);
}

function closeSettings() {
	if(OS_IOS) {
		$.NavWindow.close();
	} else {
		$.SettingsWindow.close();
	}
}

init();