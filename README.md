# MAKE: George (the talking plant)

![MAKE George the talking plant](http://make.analogfolk.com/wp-content/uploads/2015/02/george-825x310.jpg)

**Overview**  
Imagine if you could talk to your house plants and they would tell you if they needed water, how hot it was and even look at you as you walk past...  

George is an experimental prototype to explore how easy it is to mix [Arduino](https://www.arduino.cc/), [Socket.io](http://socket.io/) and the [HTML5 Web Speech API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html) (Speech & Synthesis) to do just that.

An article about George can be found on the [AnalogFolk MAKE website](http://make.analogfolk.com/george-the-talking-plant/). This repo contains the code and steps to set up your very own George.

**How it works**  
There are 3 main parts to George:

1. Aurdino application: *Written in C++ to output the data from the sensors*
2. Socket.io script: *Reads and broadcasts the sensor data as JSON*
3. HTML5 script: *Reads the data excutes speech recognition and speech synthesis using the [HTML5 Web Speech API](https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html)*

## Hardware requirements

A George MAKE kit can be [purchased from ETSY](https://www.etsy.com/uk/listing/239020629/george-the-talking-plant-arduino).

Alternatively you can source your own hardware from the list below (*but we can't guarantee the code will work parts you source yourself*):

* LM35 Temp Sensor
* Soil Hygrometer Humidity Detection
* PIR Motion Sensor
* MAX7219 8x8 LED Dot Matrix Display
* Light Sensor
* Arduino Uno

## Software requirements/dependencies

* Node
* Serialport
* Socket.io
* Express
* Crypto

## Installation & Usage

1. Fork the repo
2. NPM install to install node dependencies
3. Wire up george using the wiring diagram provided (you can also work out wiring by reading the sensor_read.ino)
4. Upload the sensor_read.ino to the Arduino Uno using the Arduino IDE
5. Run node index.js and visit http://localhost:8000 to interact with George

## Contributing

1. Folking fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

A [MAKE](http://make.analogfolk.com) project hacked together by Mate Marschalko ([@MateMarschalko](https://twitter.com/MateMarschalko)) at [AnalogFolk](http://analogfolk.com) ([@analogfolk](https://twitter.com/analogfolk)).
