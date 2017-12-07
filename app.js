'use strict';

// Imports for Dialogflow
const App = require('actions-on-google').DialogflowApp;

// Imports for node rest client
const Client = require('node-rest-client').Client;
const client = new Client();

// Imports for express
const express = require('express');
const bodyParser = require('body-parser');
const expressApp = express();
expressApp.use(bodyParser.json());
expressApp.set('port', (process.env.PORT || 5000));

// Get key from environment
const KEY = process.env.KEY;

// List of actions
const CLASS_NAME = 'class_name';
const CLASS_DESCRIPTION = 'class_description';
const CLASS_PROF = 'class_prof';
const BUILDING_NAME = 'building_name';
const FOOD_OPEN = 'food_open';

// List of entities
const SUBJECT_ARGUMENT = 'subject';
const NUMBER_ARGUMENT = 'number';
const BUILDING_ARGUMENT = 'building';


// Express function
expressApp.post('/webhook', function (request, response) {
	const app = new App({request, response});

	function className (app) {
		let subject = app.getArgument(SUBJECT_ARGUMENT);
		let number = app.getArgument(NUMBER_ARGUMENT);

		const url = `https://api.uwaterloo.ca/v2/courses/${subject}/${number}.json?key=${KEY}`;
		const args = {
			headers: {},
			data: {},
		};
		client.get(url, args, (data, postResponse) => {
			if (postResponse.statusCode == 200) {
				app.ask(subject + ' ' + number + ' is ' + data.data.title + '. What else would you like to know?');
			}
			else {
				app.tell('Oops. There was an error.');
			}
		});
	}

	function classDescription (app) {
		let subject = app.getArgument(SUBJECT_ARGUMENT);
		let number = app.getArgument(NUMBER_ARGUMENT);

		const url = `https://api.uwaterloo.ca/v2/courses/${subject}/${number}.json?key=${KEY}`;
		const args = {
			headers: {},
			data: {},
		};
		client.get(url, args, (data, postResponse) => {
			if (postResponse.statusCode == 200) {
				app.ask('Here\'s a brief description I found about ' + subject + ' ' + number + ': ' + data.data.description.split('[')[0] + ' What else would you like to know?');
			}
			else {
				app.tell('Oops. There was an error.');
			}
		});
	}

	function classProf (app) {
		let subject = app.getArgument(SUBJECT_ARGUMENT);
		let number = app.getArgument(NUMBER_ARGUMENT);

		const url = `https://api.uwaterloo.ca/v2/courses/${subject}/${number}/schedule.json?key=${KEY}`;
		const args = {
			headers: {},
			data: {},
		};
		client.get(url, args, (data, postResponse) => {
			if (postResponse.statusCode == 200) {
				if (data.data && data.data[0] && data.data[0].classes && data.data[0].classes[0] && data.data[0].classes[0].instructors && data.data[0].classes[0].instructors[0]) {
					const firstName = data.data[0].classes[0].instructors[0].split(',')[1];
					const lastName = data.data[0].classes[0].instructors[0].split(',')[0];
					app.ask('The instructor for ' + subject + ' ' + number + ' is ' + firstName + ' ' + lastName + '. What else would you like to know?');
				}
				else {
					app.ask('Sorry, it seems like ' + subject + ' ' + number + ' isn\'t offered right now. What else would you like to know?');
				}
			}
			else {
				app.tell('Oops. There was an error.');
			}
		});
	}

	function buildingName (app) {
		let building = app.getArgument(BUILDING_ARGUMENT);

		const url = `https://api.uwaterloo.ca/v2/buildings/${building}.json?key=${KEY}`;
		const args = {
			headers: {},
			data: {},
		};
		client.get(url, args, (data, postResponse) => {
			if (postResponse.statusCode == 200) {
				app.ask(building + ' stands for ' + data.data.building_name + '. What else would you like to know?');
			}
			else {
				app.tell('Oops. There was an error.');
			}
		});
	}

	function foodOpen (app) {
		const url = `https://api.uwaterloo.ca/v2/foodservices/locations.json?key=${KEY}`;
		const args = {
			headers: {},
			data: {},
		};
		client.get(url, args, (data, postResponse) => {
			if (postResponse.statusCode == 200) {
				var foodList = [];
				for (var i = 0; i < data.data.length; i++) {
					if (data.data[i].is_open_now) {
						foodList.push(data.data[i].outlet_name);
					}
				}
				if (foodList.length == 0) {
					app.ask('There are currently no food services locations open. What else would you like to know?');
				}
				else {
					app.ask('The food services locations that are currently open include: ' + foodList + '. What else would you like to know?');
				}
			}
			else {
				app.tell('Oops. There was an error.');
			}
		});
	}

	let actionMap = new Map();
	actionMap.set(CLASS_NAME, className);
	actionMap.set(CLASS_DESCRIPTION, classDescription);
	actionMap.set(CLASS_PROF, classProf);
	actionMap.set(BUILDING_NAME, buildingName);
	actionMap.set(FOOD_OPEN, foodOpen);
	app.handleRequest(actionMap);
});

expressApp.listen(expressApp.get('port'), function () {
	console.log('Webhook started');
});