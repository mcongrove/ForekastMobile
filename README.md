[![Forekast](https://raw.githubusercontent.com/mcongrove/ForekastMobile/master/forekast.png)](https://github.com/mcongrove/ForekastMobile)

# Forekast Mobile Application

The Forekast mobile application supports iOS and Android, and is built on the [Appcelerator](http://www.appcelerator.com/) platform. The application is coded mostly in JavaScript.

### Attribution

Application designed and developed by [Matthew Congrove](https://github.com/mcongrove), with contributions by:

 * [Chris Bowley](https://github.com/fridayforward)
 * [Rick Blalock](https://github.com/rblalock)

This application is __not__ owned or maintained by Forekast. Forekast, the astronaut logo, and data used with permission of Forekast, Inc.

Special thanks to the entire Forekast team for creating an amazing service and letting this app be created.

### Contributing

Any feedback, requests, or code changes are absolutely welcome and appreciated.

Feature requests and bug reports can be created as a [GitHub Issue](https://github.com/mcongrove/ForekastMobile/issues).

##### Code Contributions

Code changes require a bit more effort. To get started, you'll need to download [Appcelerator Titanium](http://www.appcelerator.com/titanium/download-titanium/) and follow the [Quick Start](http://docs.appcelerator.com/titanium/latest/#!/guide/Quick_Start) guide. Titanium is well-documented with API information, guides, and tutorials.

To submit a code change, please [fork this repository](https://github.com/mcongrove/ForekastMobile/fork) to your personal GitHub account. After making your changes, submit a [pull request](https://github.com/mcongrove/ForekastMobile/pulls). Your changes will be reviewed by one of the project administrators for various checks, including:

 * Best practices
 * Performance
 * Cross-platform / cross-form-factor compatibility
 * Code conflicts
 * Code standards (yes, we will reject ugly code; see next section)

Code changes that fail to meet the above standards, or for any other reason at the discretion of the project administrators, will be rejected. _We will do our best to work with you to improve your pull request until it's deemed acceptable._

If you're taking on a bug, please comment on the [Issue](https://github.com/mcongrove/ForekastMobile/issues) so that work isn't duplicated.

If you'd like to add a completely new feature, please submit an [Issue](https://github.com/mcongrove/ForekastMobile/issues) so that we may all discuss the benefits. This is to ensure that you don't waste your time developing a feature we won't implement.

Anyone who submits a few successfully merged pull requests will be added to the contributors list, at the discretion of project administrators.

###### Developer Notices

To protect private key information, the `app/config.json` file has been cleansed and renamed to `app/config.json.example`. Please remove the `.example` from the file before compiling the application.

You'll also need to install the following modules:

 * [StyledLabel](https://github.com/appcelerator/titanium_modules/tree/master/styledlabel) for iOS
 * [TiSocial](https://github.com/viezel/TiSocial.Framework) for iOS
 * [LocalNotify](https://github.com/benbahrenburg/LocalNotify) for iOS
 * [AlarmManager](https://github.com/benbahrenburg/benCoding.AlarmManager) for Android

### Code Standards

We've included JS Beautifier in this project; it automatically runs each time you compile to keep the code uniform. Please try to learn the coding style already in-use throughout the application.

Documentation of code is required.