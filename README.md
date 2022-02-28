# bettertaskfilter

## Overview
Creating a filter in Todoist, where the tasks are sorted based on their priority and assigned project. <br><br>

## Notice
The functionality of this application has been available in Todoist since 2020. I did not look into it before working on this project. The blog where it is explained: [Doist Blog](https://blog.doist.com/todoist-sorting-options/#labels-filters) <br>
Even though Todoist already has this functionality built-in, this project was still a good learning exercise into TypeScript & Node.JS. <br><br>

## Motivation
Todoist is a service to store tasks, like a to-do list. These tasks can be assigned to different projects.
The service can display tasks based on a selected date, like `tasks for today` or `tasks that are due next wednesday`. With this, the tasks get sorted based on their priority. The highest (priority 1) is on top and tasks with priority 4 are on the bottom. <br>
The problem hereby is that tasks that have the same priority but belong to different projects, are displayed underneath each other. This view makes it difficult to keep track of the tasks that belong to one project.

Filters can be a solution, which can be configured to only show tasks based on a set of conditions, like `only show high priority tasks` or `show tasks that occur every month`. <br>
One problem:  there is a limit of 3 filters with a Free account. If a project's name is changed or a new one is added, then said filter needs to be modified. This can become tedious over time. A non-free solution would be to pay €4 per month, which gives an account access to 150 filters. <br>
Another solution would be to use the [Todoist API](https://developer.todoist.com/guides/#developing-with-todoist) to create custom logic for this problem. The logic would retrieve the important tasks and create a new filter, where the tasks are ordered by their associated project.

Another motivation for this project was an article by Michael Wille. He created a Python script which addressed the same problem. His article was an insight into the capabilities of the Todoist API. The aricle in question: [Link](https://mike.ps/todoist-today-by-project)

This project is also created to build experience with TypeScript & Node.js, which I have not worked with before. <br><br>

## Workflow
The project makes use of two filters, one to get all the tasks for today, based on a few conditions, and another one to show tasks based on their priority and project. Filters are used to still stay in the Todoist environment & to make task changes more accessible. The API provided access to the [filters](https://developer.todoist.com/sync/v8/#filters)

The application runs when a certain endpoint is called from a client application. <br>
The project first retrieves all the filters of the account & filters out the two required filters to the rest of the application. <br>
After that, all important tasks are retrieved by using the first filter The project id's of the tasks are then copied. <br>
After obtaining the id's, the application retrieves the project names and the duplicates are filtered out. <br>
These names are used to create the new filter query for the second filter. The query is used to specify which tasks are displayed on a filter. After the query is created, it is then applied to the second filter. <br>
Once the filter phase is completed, the application notifies the user by sending an Embed message to a Discord channel. <br><br>

## Setup
The `.env.example` file contains the environment variables that are needed to run the application. The keys inside this file can be put in a `.env` file and populated with the values. <br>

The following values are needed for the keys:
* PORT -- The port number for the 'express' webserver.
* TODOIST_TOKEN -- The API token to communicate with the Todoist API.
* FILTER_BUCKET_ID -- The ID of the first filter, which has all the important tasks of the day.
* FILTER_ORDER_ID -- The ID of the second filter, which will have all the tasks grouped by priority and assigned project.
* FILTER_ORDER_QUERY -- The query that is used for the second filter, to get tasks based on their priority and assigned project.
* DISCORD_TOKEN -- The Discord token used to communicate with a Discord Bot.
* DISCORD_CHANNEL_NAME -- The name of the Discord channel to send the Embed message to.

The command to install all the dependencies is `npm install`.
The command to start the project is `npm run start`. This runs the TypScript compiler to produce JavaScript versions of the TypeScript files & place then in a 'dist' folder which will also be created during this process.
After the JavaScript files are generated, Node.JS will be started on the `index.js` file.

To start the filter process, send an empty POST HTTP request to the following endpoint: `{HOST:PORT}/filterpriority`. <br><br>

## Docker
The Dockerfile can be used to create Docker images & containers. It is also available on [DockerHub](https://hub.docker.com/repository/docker/mrtech12/bettertaskfilter). <br>
To run a container, a couple environment variables need to be supplied in order to make it communicate with external services. A port needs to be supplied as well. <br>
The environment values can be put in a file called `env.list` with the format of `key=value`. Quotes are not needed. <br> To pass the file to the container, use the `--env-file` flag. For the port, use the `-p` flag with this format: `0000:0000`.

The following variables & their values are needed:
* PORT -- The port number for the 'express' webserver.
* TODOIST_TOKEN -- The API token to communicate with the Todoist API.
* FILTER_BUCKET_ID -- The ID of the first filter, which has all the important tasks of the day.
* FILTER_ORDER_ID -- The ID of the second filter, which will have all the tasks grouped by priority and assigned project.
* FILTER_ORDER_QUERY -- The query that is used for the second filter, to get tasks based on their priority and assigned project.
* DISCORD_TOKEN -- The Discord token used to communicate with a Discord Bot.
* DISCORD_CHANNEL_NAME -- The name of the Discord channel to send the Embed messages to.
* TZ -- The timezone of the container to display the right time in the log messages. See this [link](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for accepted values.

To start the filter process, send an empty POST HTTP request to the following endpoint: `{HOST:PORT}/filterpriority`. <br><br>

## External sources
The project makes use of the `axios` library to communicate with Todoist. <br>
There are two API's for Todoist interactions: the REST API & the Sync API.
* The REST API is used for retrieving tasks and projects.
* The Sync API is used for retrieving and updating filters.
The project also makes use of the `discord.js` library, to send an Embed message to a Discord channel for notifying the user. <br><br>


## Disclaimer
This project is NOT created by, affiliated with, or supported by Doist.