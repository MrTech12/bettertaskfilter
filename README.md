# bettertaskfilter

## Overview
Creating a filter in Todoist, which creates a view where tasks are shown based on their priority and project.

## Motivation
Todoist is a service to store tasks, like a to-do list. These tasks can be seperated into projects. There are filters available to only show tasks based on a set of conditions, like 'only show important tasks' or 'show tasks that occur every month'.
The service can display tasks based on a selected date, like 'tasks for today' or 'tasks that are due next wednesday'. With this mode, the tasks get displayed in order of their priority. 
The problem hereby is that tasks that have the same priority but belong to different projects, are not easy to keep track off. They will be displayed underneath each other.

Filters can be a solution, but there is a limit of 3 filters with a Free account. Changing a project's name or adding a new one requires modifying the filter as well. This can become tedious over time. A non-free solution would be to pay €4 per month, which provides 150 filters to use.
A better solution would be to use the [Todoist API](https://developer.todoist.com/guides/#developing-with-todoist) to create custom logic for this problem. The logic would retrieve the important tasks and create a new view where the tasks are displayed by their associated project.

Another motivation for this project was an article by Michael Wille. He created a Python script which addressed the same problem which is described above. His article was an insight into the capabilities of the Todoist API. The aricle in question: [Link](https://mike.ps/todoist-today-by-project)

## Workflow
The project makes use of two filters, one to get tasks, based on a few conditions and another one to show the retrieved tasks, based on their priority and project. Filters are used to still stay in the Todoist environment & to make task changes more accessible. The API provided access to the [filters](https://developer.todoist.com/sync/v8/#filters)

The application runs when a certain endpoint is called from a client application.
The project first retrieves all the filters of the account & passes only the two required filters to the rest of the application.
After that, tasks are retrieved with the first filter, that is used to retrieve all important tasks. The project id's of the tasks are retrieved and the duplicates are filtered out.
After obtaining the id's, the application retrieves the project names. These names are used to create the new filter query for the second filter. After the query is created, it is then applied to the second filter.
Once the filter phase is complete, the application sends an Embed message to a Discord channel, to notify the user.

## Setup
The `.env.example` file contains the environment variables that are needed to run the application. The keys inside this file can be put in a `.env` file and populated with the values.
The following values are needed for the keys:
* PORT -- The port number for the 'express' webserver.
* TODOIST_TOKEN -- The API token to communicate with a Todoist account.
* FILTER_BUCKET_ID -- The ID of the first filter, which has all the important tasks of the day.
* FILTER_ORDER_ID -- The ID of the second filter, which will have all the tasks sorted by priority and project.
* FILTER_ORDER_QUERY -- The query that is used for the second filter, to get tasks based on their priority and project.
* DISCORD_TOKEN -- The Discord token used to communicate with a Discord Bot.
* DISCORD_CHANNEL_NAME -- The name of the Discord channel to send the messages to.

The command to start the project is `npm run start`. This run run the TypScript compiler to produce JavaScript versions of TypeScript files & place then in a 'dist' folder which will also be created during this process.
After the JavaScript files are generated, node will be started on the `index.js` file.

To start the filter process, send an empty POST HTTP request to the following endpoint: `/filterpriority`.

## External sources
The project makes use of the `axios` library to communicate with the service.
There are two API's for interactions: the REST API & the Sync API.
* The REST API is used for retrieving tasks and projects.
* The Sync API is used for retrieving and updating filters.
The project also makes use of the `discord.js` library, to send an Embed message to a Discord channel for notifying the user.


## Disclaimer
This project is NOT created by, affiliated with, or supported by Doist.