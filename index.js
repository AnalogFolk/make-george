//	Simple HTTP server
//	var serialport = require("serialport"),
//		SerialPort = serialport.SerialPort,
//		express = require('express'),
//		app = express(),
//		server = require('http').createServer(app).listen(8080),    
//		io = require('socket.io').listen(server);


// Library includes
var fs = require('fs'),
	express = require('express'),
	app = express(),
	https = require('https'),
	io = require('socket.io'),
	serialport = require("serialport"),
	SerialPort = serialport.SerialPort;

// SSH keys
var key = fs.readFileSync('key.pem'),
	cert = fs.readFileSync('cert.pem')
	https_options = {
	    key: key,
	    cert: cert
	};

// Server settings
var	PORT = 8000,
	HOST = 'localhost',
	USB  = '/dev/tty.usbmodem1411';

//
// Start HTTPS server with socket.io
server = https.createServer(https_options, app).listen(PORT, HOST);
io = io.listen(server);

console.log('HTTPS Server listening on %s:%s', HOST, PORT);

//
// Open USB  port
var myPort = new SerialPort(USB, { 
	// look for return and newline at the end of each data packet
	parser: serialport.parsers.readline("\r\n")
});

var connected = false;

//  
// Respond to web GET requests with index.html page:
app.get('/', function (request, response) {
	response.sendfile(__dirname + '/index.html');
});

//
// Define route folder for static requests
app.use(express.static(__dirname + '/'));

//
// Listen for new socket.io connections when browser connected
io.sockets.on('connection', function (socket) {

	if (!connected) {
		// clear out any old data from the serial bufffer:
		myPort.flush(function(){});
		// send a byte to the serial port to ask for data:
		myPort.write('c');
		console.log('browser connected');
		connected = true;
	}

	// Handle client disconnect:
	socket.on('disconnect', function () {
		myPort.write('x');
		console.log('browser disconnected');
		connected = false;
	});

	//
	// Listen for new serial data
	myPort.on('data', function (data) {
		// Convert the string received into a JSON object:
		var serialData = tryParseJSON(data);
		// send a serial event to the web client with the data:
		socket.emit('serialEvent', serialData);
	});
});

function tryParseJSON (jsonString){
	try {
		var o = JSON.parse(jsonString);
		if (o && typeof o === "object" && o !== null) {
			return o;
		}
	}
	catch (e) { }
	return false;
};

