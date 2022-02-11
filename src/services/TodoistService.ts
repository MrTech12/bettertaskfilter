import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import logger from 'npmlog';
import * as DateTimeHelper from '../helpers/DateTimeHelper';

const syncAPI = 'https://todoist.com/api/v8/sync';
const restAPITasks = 'https://api.todoist.com/rest/v1/tasks';
const restAPIProjects = 'https://api.todoist.com/rest/v1/projects';

export async function retrieveFilters(): Promise<FilterInterface[]> {
    const body: FilterBodyInterface = { 'sync_token': '*', 'resource_types': ['filters'] };
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    let allFilters: FilterInterface[] = [];
    
    await axios.post(syncAPI, body, axiosConfig)
        .then(response => {
            allFilters = response.data.filters;
            logger.info(`From REST filter response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'All filters have been retrieved.');
        })
        .catch((error) => logger.error(`From REST filter response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'There is a problem retrieving the filters of the account.'));
    return allFilters;
};

export async function retrieveTasks(bucketFilter: FilterInterface): Promise<TaskInterface[]> {
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    let bucketFilterQuery: string = bucketFilter.query.split('&').join('%26');
    let tasks: TaskInterface[] = [];
    let uri: string = `${restAPITasks}?filter=${bucketFilterQuery}`;

    await axios.get(uri, axiosConfig)
        .then(response => {
            response.data.forEach((task: TaskInterface) => { tasks.push(task) });
            logger.info(`From REST task response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'All tasks have been retrieved.');
        })
        .catch((error) => logger.error(`From REST task response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'There is a problem retrieving the tasks of the account.'));
    return tasks;
};

export async function retrieveProjectNames(tasks:TaskInterface[]): Promise<string[]> {
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };
    
    let projectNames: string[] = [];

    for (let index = 0; index < tasks.length; index++) {
        let uri: string = `${restAPIProjects}/${tasks[index].project_id}`;

        await axios.get(uri, axiosConfig)
            .then(response => projectNames.push(response.data.name))
            .catch((error) => logger.error(`From REST project response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'There is a problem retrieving the projects of the account.'));
    }
    logger.info(`From REST project response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'All project names of the retrieved tasks have been retrieved.');
    return projectNames;
};

export async function updateOrderFilter(filterQuery: string): Promise<void> {
    const body: UpdateFilterBodyInterface = { 'commands': [
        {'type': 'filter_update', 'uuid': `${uuidv4()}`, 'args': {'id': `${process.env.FILTER_ORDER_ID}`, 'query': `${filterQuery}`}}
    ] };
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    await axios.post(syncAPI, body, axiosConfig)
        .then(response => logger.info(`From REST filter_update response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'The filter query has been updated.'))
        .catch(error => logger.error(`From REST filter_update response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'There is a problem updateing the filter of the account.'));
};