function APP(){};
var app = new APP();
var second = seconds = 1000;
var minute = minutes = 60 * seconds;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

watered = {
	returnDate: function(){
		return watered.interpretDate( localStorage["lastWatered"] );
	},
	interpretDate: function(pubdate){
		pubdate = new Date(pubdate);

		var currentdate = new Date(),
			thedate = new String(),
			weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],

			currentyear = currentdate.getFullYear(),
			currentmonth = currentdate.getMonth() + 1,
			currentday = currentdate.getDate(),
			currentweekday = weekdays[ currentdate.getDay() - 1 ],
		
			pubyear = pubdate.getFullYear(),
			pubmonth = pubdate.getMonth() + 1,
			pubday = pubdate.getDate(),
			pubweekday = weekdays[ pubdate.getDay() - 1 ];

		if(currentyear == pubyear) {
			// this year
			if(currentmonth == pubmonth) {
				// this month
				if((currentday - pubday) < 7) {
					// this week
					if(currentday == pubday) {
						// today
						thedate = "today";
					} else if (currentday > pubday){
						// day(s) ago
						if((currentday - pubday) == 1) {
							// yesterday
							thedate = "yesterday";
						} else if((currentday - pubday) > 1) {
							// more than a day ago this week
							thedate = "last " + pubweekday;
						}
					}
				} else if ((currentday - pubday) >= 7){
					// week(s) ago
					var weeks = parseInt( (currentday - pubday) / 7 );
					thedate = weeks > 1 ? weeks + " weeks ago" : "last week";
				}

			} else if (currentmonth > pubmonth){
				// month(s) ago
				var months = currentmonth - pubmonth;
				thedate = months > 1 ? months + " months ago" : "last month";
			}
		} else if (currentyear > pubyear) {
			// year(s) ago
			var years = currentyear - pubyear;
			thedate = years > 1 ? years + " years ago" : "last year";
		}

		return thedate;
	}
}

plant = {
	complain: {
		hot: [
			"It's too hot in here.",
			"It's really warm in here",
			"I can't take this temperature",
			"My leaves are burning",
			"Can someone turn off the heating please?"
		],
		cold: [
			"It's too cold in here.",
			"It's really cold in here",
			"It's freezing",
			"I can't take this temperature",
			"Can someone turn up the heating please?"
		],
		dark: [
			"It's too dark in here",
			"Can you put me closer to the window?",
			"I can't photosynthesis. I need light",
			"It's really dark in here",
			"Why is it so dark?"
		],
		dry: [
			"My soil is really dry.",
			"Could you please water me?",
			"I could really use some water.",
			"Water me please!",
			"I'm really thirsty."
		]
	},

	thank: {
		water: [
			"Thanks for watering me! My soil was really dry",
			"I was really thirsty. Thanks for watering me!",
			"Oh, that feels really good. Thanks for watering me! My leaves will be much greener tomorrow!",
			"Thanks for watering me! I really appreciate it! My soil was really dry.",
			"Thank you so much for watering me! That feels really good!"
		]
	},

	greet: [
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?",
		"Hi! How's your day?"
	],

	answer: {
		measurement: [
			"I'm 26 centimeters tall.",
			"I'm 26 centimeters high."
		],
		age: [
			"I'm almost 6 months old.",
			"I'm almost half a year old."
		],
		water: [
			"I was watered ",
			"You watered me "
		],
		hate: [
			"I hate you more",
			"I hate you too"
		],
		normal: [
			"It's ",
			"The temperature is "
		],
		hot: [
			"I think it's quite hot in here. The temperature is ",
			"It's warm in here, I think. The temperature is "
		],
		cold: [
			"I think it's quite cold in here. The temperature is ",
			"It's cold in here, I think. The temperature is "
		],
		good: [
			"I feel good right now.",
			"I'm happy right now."
		],
		asking: [
			"Thanks for asking. ",
			"Thanks for the question. "
		],
		kind: [
			"I don't know. I'm just a very simple house plant.",
			"I don't have exact information on that. I'm just a simple house plant."
		],
		hurt: [
			"Would you actually do that?",
			"Please don't hurt me.",
			"I don't want to be cut."
		],
		pleased: [
			"Glad to hear that!!",
			"Happy to hear that!"
		]
	}
}

app = {
	plantData: {},
	speech: new SpeechSynthesisUtterance(),
	voices: window.speechSynthesis.getVoices(),
	listen: new SpeechRecognition(),
	recentlySpoken: false,
	justSpoken: false,
	recentlyWatered: false,
	moisture: 999,
	previousQuestion: "",

	temp_min: 18,
	temp_max: 26,
	light_min: 30,
	moist_min: 66,
	
	speak: function(message, interrupt){

		if( (!app.recentlySpoken && !app.recentlyWatered && !app.justSpoken) ||
			(!app.recentlyWatered && !app.justSpoken && interrupt)){
			app.recentlySpoken = true;
			app.speech.text = message;
			app.setVoice();
			speechSynthesis.speak(app.speech);
			console.log(message);
		}

		if(interrupt){
			app.recentlyWatered = true;
			clearTimeout(app.wateredTimer);
			app.wateredTimer = setTimeout(function(){
				app.recentlyWatered = false;
			}, 10 * seconds);
		}

	},

	answer: function(message){
		clearTimeout(app.justSpokenTimer);
		app.justSpokenTimer = setTimeout(function(){
			app.justSpoken = false;
		}, 5 * seconds);

		if(!app.justSpoken) {
			app.justSpoken = true;
			app.speech.text = message;
			app.setVoice();
			speechSynthesis.speak(app.speech);
			console.log(message);
		}

	},

	setVoice: function(){
		app.voices = window.speechSynthesis.getVoices();
		app.speech.voice = app.voices.filter(function(voice) { return voice.name == 'Google UK English Male'; })[0];
	},
	
	rdm: function(range){
		return parseInt(Math.random() * range);
	},

	interpret: function(result){

		var text = "",
			confidence = 0,
			selected = -1;

		for(var i=0; i<result.results.length; i++){
			//if(result.results[i].isFinal){
				if(result.results[i][0].confidence > confidence && result.results[i][0].confidence > 0.70) selected = i;
			//}
		}

		if(selected > -1) {

			text = result.results[selected][0].transcript;

			if(text != app.previousQuestion){

				app.previousQuestion = text;

				var temp = "normal";
				if(app.plantData.temperature < app.temp_min) {
					temp = "cold";
				} else if (app.plantData.temperature > app.temp_max) {
					temp = "hot";
				}

				var moist = "normal";
				if(app.plantData.moisture < app.moist_min) {
					moist = "low";
				}

				var light = "normal";
				if(app.plantData.light < app.light_min) {
					light = "low";
				}

				var feeling = "";
				if(temp  != "normal") feeling += (plant.answer[temp][app.rdm(2)] + " " + app.plantData.temperature + " degrees");
				if(moist != "normal") feeling += (feeling != "" ? " and " : "") + (plant.complain.dry[app.rdm(5)] + " ");
				if(light != "normal") feeling += (feeling != "" ? " and " : "") + (plant.complain.dark[app.rdm(5)] + " ");
				if(feeling == "") feeling += plant.answer.good[app.rdm(2)];

				// Feel
				if(app.matchWords(
					["happy", "sad", "you feel", "how are you"],
					text
				)){
					app.answer(
						plant.answer.asking[app.rdm(2)] + feeling
					);
				}
			
				// Temperature
				if(app.matchWords(
					["temperature", "hot", "cold", "warm"],
					text
				)){
					app.answer(
						plant.answer[temp][app.rdm(2)] + " " +
						app.plantData.temperature +
						" degrees"
					);
				}

				// Height
				if(app.matchWords(
					["high", "tall", "size"],
					text
				)){
					app.answer(
						plant.answer.measurement[app.rdm(2)]
					);
				}

				// Age
				if(app.matchWords(
					["old", "age"],
					text
				)){
					app.answer(
						plant.answer.age[app.rdm(2)]
					);
				}

				// Hate
				if(app.matchWords(
					["hate", "dislike"],
					text
				)){
					app.answer(
						plant.answer.hate[app.rdm(2)]
					);
				}

				// Watered
				if(app.matchWords(
					["water", "watered", "thirsty", "drink", "moist", "moisture", "soil"],
					text
				)){
					app.answer(
						(moist == "normal" ? plant.answer.good[app.rdm(2)] : plant.complain.dry[app.rdm(5)]) + " " +
						plant.answer.water[app.rdm(2)] + " " +
						watered.returnDate()
					);
				}

				// 
				// Kind
				if(app.matchWords(
					["kind", "type", "origin"],
					text
				)){
					app.answer(
						plant.answer.kind[app.rdm(2)]
					);
				}

				// 
				// Hurt
				if(app.matchWords(
					["scissors", "knife", "trim", "cut"],
					text
				)){
					app.answer(
						plant.answer.hurt[app.rdm(2)]
					);
				}

				// 
				// Answered
				if(app.matchWords(
					["good", "fine"],
					text
				)){
					app.answer(
						plant.answer.pleased[app.rdm(2)]
					);
				}
			}
		}
	},

	matchWords: function(words, text){
		var match = false;
		for(var i = 0; i < words.length; i++){
			if(text.indexOf(words[i]) > 0) match = true;
		}
		return match;
	}
	
};

function init(){

	// Open a connection to the serial server:
	var socket = io.connect('https://localhost:8000');

	// Listen for new socket.io messages from the serialEvent socket
	socket.on('serialEvent', function (data) {

		app.plantData = data;

		if(app.moisture == 999) app.moisture = parseInt(app.plantData.moisture);

		//
		// Handle SPEAK
		if(app.moisture + 10 < data.moisture) {
			// I'm being watered
			app.moisture = parseInt(data.moisture);
			app.speak(
				plant.thank.water[app.rdm(5)] + " The last time I was watered was " + watered.returnDate(), true
			);
			localStorage.setItem("lastWatered", new Date());
		}

		if(data.motion1 || data.motion2) {
			// Someone is around

			if(data.moisture >= app.moist_min && data.temperature <= app.temp_max && data.temperature >= app.temp_min && data.light >= app.light_min ){
				// I'm happy with everything
				app.speak(
					plant.greet[app.rdm(10)], false
				);
			} else {

				if(data.moisture < app.moist_min) {
					// I'm thirsty
					app.speak(
						plant.complain.dry[app.rdm(5)], false
					);
				}

				if(data.temperature < app.temp_min) {
					// I'm cold
					app.speak(
						plant.complain.cold[app.rdm(5)] + " It's " + data.temperature + " degrees.", false
					);
				}

				if(data.temperature > app.temp_max) {
					// I'm hot
					app.speak(
						plant.complain.hot[app.rdm(5)] + " It's " + data.temperature + " degrees.", false
					);
				}

				if(data.light < app.light_min) {
					// It's dark
					app.speak(
						plant.complain.dark[app.rdm(5)], false
					);
				}
			}
		}

	});

	//
	// Handle LISTEN
	app.listen.continuous = true;
	app.listen.interimResults = true;
	app.listen.lang = 'en-GB';
	app.listen.start();
	app.listen.onresult = app.interpret;
	app.listen.onend = function(){
		console.log("Restarted listening.");
		app.listen.start();
	}

	// Sampling moisture for determining last watering
	app.moistureTimer = setInterval(function(){
		app.moisture = parseInt(app.plantData.moisture);
	}, 30 * seconds);

	// Allowing plant to speak every 5 minutes
	app.spokenTimer = setInterval(function(){
		app.recentlySpoken = false;
	}, 60 * seconds);

}

//
// Start app
window.onload = init;
