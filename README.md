# uwAPI
uwAPI is an Actions on Google app built using Dialogflow, Node.js and Heroku. It uses the University of Waterloo Open Data API to answer questions the user has about the University.

## How it works
uwAPI has a front-end that is configured using Dialogflow, which can understand simple questions about the University. These intents are then sent to the Node.js function on Heroku, which makes the API calls to the University of Waterloo Open Data API site. When it receives a result, the Node.js function processes the data, and returns it to Dialogflow in a format that can be understood by the user.

## What are some questions it understands?
uwAPI understands simple questions such as asking for course titles, course instructions, course descriptions and what restaurants are open.

## Why can't I find it on Actions on Google?
The uwAPI Actions on Google app is not published as it was more of a proof-of-concept project to experiment and learn more about Dialogflow and Node.js.
