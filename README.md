# mahrio-server

This is a simple demonstration to show a Hapi Server provision integrated with a Mobile App. The `server.js` uses the
npm module `mahrio` which abstracts the server setup and configuration to run the server. In addition, the server uses
socket.io to listen for socket connections.

## server.js

* `process.env.NODE_URL` is used to set the IP address where the server will run. This needs to be same IP address the
host machine uses to connect to the internet. If this line is commented it defaults to be '127.0.0.1' (localhost)

## mobile/

Inside this folder you will find the Ionic mobile app.

### cordova bluetooth

The branch ionic-hm-10 contains an ionic app which depends on cordova-plugin-ble-central (https://github.com/don/cordova-plugin-ble-central). This plugin has to be installed in (e.g. `cordova plugin add cordova-plugin-ble-central --variable BLUETOOTH_USAGE_DESCRIPTION="Your description here"` within mobile folder. Once app is installed, you can upload to ionic view. To test you will need to upload code from arduino/hm10test/hm10test.ino into an Arduino microcontroller. Then you may shutdown device to install bluetooth module (HM-10) and the power up Arduino. In the mobile you can locate the bluetooth module by going to bluetooth tab and pulling down to refresh (scan) for devices. When yoou find HMSoft, click on it and you will see its info. Under the info are two buttons, one to toggle built-in LED 13 on and off. The other is to blink LED.

Right now the baud rate is 9600 for bluetooth which is a bit slow. Trying to figure out how to raise it to 112500 for significant performance improvement.

### mobile/www/index.html

This is the entry into Ionic. Here we include other dependencies such as scripts, styles, and ionic. This file also contains
the connection to the server via sockets. `var socket = io('<ip-address-of-server>');`

## Run Locally

* clone this repo (`git clone https://github.com/ComputerEnchiladas/mahrio-server.git`)
* update server.js with your IP address or comment out to use localhost
* update mobile/www/index.html with the server's IP address
* run node server (`node server.js`) 
* go to mobile folder, then run mobile app (`ionic serve`)
