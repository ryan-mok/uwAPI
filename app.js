'use strict';

const App = require('actions-on-google').DialogflowApp;

const http = require('http');
const Client = require('node-rest-client').Client;
const client = new Client();

const KEY = process.env.KEY;

const CLASS_NAME = 'class_name';
const SUBJECT_ARGUMENT = 'subject';
const NUMBER_ARGUMENT = 'number';

const express = require('express')
const bodyParser = require('body-parser')
const expressApp = express()
expressApp.use(bodyParser.json())
expressApp.set('port', (process.env.PORT || 5000))

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
			console.log(postResponse)
			if (postResponse.statusCode == 200) {
				app.tell('The course title for ' + subject + ' ' + number + ' is ' + data.data.title + '.');
			}
			else {
				app.tell('Oops. There was an error.');
			}
		});
	}

	let actionMap = new Map();
	actionMap.set(CLASS_NAME, className);
	app.handleRequest(actionMap);
})

expressApp.listen(expressApp.get('port'), function () {
	console.log('Webhook started')
})