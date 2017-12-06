'use strict';

// Imports for Dialogflow
const App = require('actions-on-google').DialogflowApp;

// Imports for node rest client
const Client = require('node-rest-client').Client;
const client = new Client();

// Imports for express
const express = require('express')
const bodyParser = require('body-parser')
const expressApp = express()
expressApp.use(bodyParser.json())
expressApp.set('port', (process.env.PORT || 5000))

// Get key from environment
const KEY = process.env.KEY;

// List of actions
const CLASS_NAME = 'class_name';
const CLASS_DESCRIPTION = 'class_description';
const CLASS_PROF = 'class_prof';

// List of entities
const SUBJECT_ARGUMENT = 'subject';
const NUMBER_ARGUMENT = 'number';


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
				app.tell(subject + ' ' + number + ' is ' + data.data.title + '.');
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
				app.tell('Here\'s a brief description I found about ' + subject + ' ' + number + ': ' + data.data.description.split('[')[0]);
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
				const firstName = data.data.classes.instructors;
				const lastName = data.data.classes.instructors;
				// const firstName = data.data.classes.instructors[0].split(',')[1];
				// const lastName = data.data.classes.instructors[0].split(',')[0];
				app.tell('The instructor for ' + subject + ' ' + number + ' is ' + firstName + ' ' + lastName + '.');
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
	app.handleRequest(actionMap);
})

expressApp.listen(expressApp.get('port'), function () {
	console.log('Webhook started')
}) 