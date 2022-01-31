# bettertaskfilter

## Overview
Creating a filter in Todoist, which creates a view where tasks are shown based on their priority and project.

## Motivation
Todoist is a service to store tasks, like a to-do list. These tasks can be seperated into projects. There are filters available to only show tasks based on a set of conditions, like 'only important tasks' or 'tasks that occur every month'.
The service has the ability to view tasks based on the selected date, like 'tasks for today' or 'tasks that are due next wednesday'. With this mode, the tasks get displayed in order of their priority. The problem hereby is that tasks that have the same priority but belong to different projects, are not easy to keep track off.

Filters can be a solution, but there is a limit of 3 filters with a Free account. Changing a project or adding a new one requires changing the filter as well. This can become tedious over time. A non-free solution would be to pay €4 per month, which provides 150 filters to use.
A better solution would be to use the [Todoist API](https://developer.todoist.com/guides/#developing-with-todoist) to create custom logic for this problem. The logic would retrieve the important tasks and create a new view where the tasks are displayed by their associated project.

## Workflow
The project makes use of two filters, one to get the specified tasks and another one to show the tasks based on their priority and project. Filters are used to still stay in the Todoist environment & to make task changes more accessible. The API provided access to the [filters](https://developer.todoist.com/sync/v8/#filters)
