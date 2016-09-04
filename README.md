# travelapp

Application is created on ionic/cordova, targeted for android platforms. Backend uses backand.

Base requirements are node.js, cordova and ionic installed.

The RAR file can be unzipped and the project run from there.

Alternatiely, a debug mode apk is included, or the www folder within the project can be used to create a ionic project for running. Note the following plugins:

        cordova-plugin-console
        cordova-plugin-device
        cordova-plugin-inappbrowser
        cordova-plugin-splashscreen
        cordova-plugin-statusbar
        cordova-plugin-whitelist
        ionic-plugin-keyboard
        uk.co.workingedge.phonegap.plugin.launchnavigator
        cordova-plugin-geolocation
        cordova-plugin-actionsheet
        cordova-plugin-compat

As some features require hardware from an android device, and CORS restrictions 'ionic serve' will not have full functionality. Use 'ionic run Android' for full functionality.

Refer to wiki for more details.
