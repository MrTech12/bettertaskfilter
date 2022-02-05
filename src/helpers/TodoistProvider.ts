import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import logger = require('npmlog');

let syncAPI = 'https://todoist.com/api/v8/sync';
let restAPITasks = 'https://api.todoist.com/rest/v1/tasks';
let restAPIProjects = 'https://api.todoist.com/rest/v1/projects';

exports.retrieveFilters = async (): Promise<FilterInterface[]> => {
    const body: FilterBodyInterface = { "sync_token": "*", "resource_types": ["filters"] }
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    let filters: FilterInterface[] = [];
    
    await axios.post(syncAPI, body, axiosConfig).then(response => {
        logger.info("From REST filter response", "All filters have been retrieved.");
        response.data.filters.forEach((filter: FilterInterface) => {
            if (filter.id == process.env.FILTER_BUCKET_ID || filter.id == process.env.FILTER_ORDER_ID) {
                filters.push(filter);
            }
        });
    }).catch((error) => logger.error("From REST filter response", "There is a problem retrieving the filters of the account."));
    logger.info("From REST filter response", "The 2 filters have been retrieved.");
    return filters;
};

exports.retrieveTasks = async (bucketFilter: FilterInterface): Promise<TaskInterface[]> => {
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    if(bucketFilter == undefined) {
        logger.error("From REST task request","The bucket filter has not been saved properly.");
        process.exit(1);
    }

    let bucketFilterQuery: string = bucketFilter.query.split("&").join("%26");
    let tasks: TaskInterface[] = [];
    let uri: string = `${restAPITasks}?filter=${bucketFilterQuery}`;

    await axios.get(uri, axiosConfig).then(response => {
        logger.info("From REST task response", "All tasks have been retrieved.");
        response.data.forEach((task: TaskInterface) => { tasks.push(task); });
    }).catch((error) => logger.error("From REST task response", "There is a problem retrieving the tasks of the account."));
    return tasks;
};

exports.retrieveProjectNames = async (tasks:TaskInterface[]): Promise<string[]> => {
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };
    let projectNames: string[] = [];

    for (let index = 0; index < tasks.length; index++) {
        let uri: string = `${restAPIProjects}/${tasks[index].project_id}`;

        await axios.get(uri, axiosConfig).then(response => {
            projectNames.push(response.data.name);
        }).catch((error) => logger.error("From REST project response", "There is a problem retrieving the projects of the account."));
    }
    logger.info("From REST project response", "All project names of the retrieved tasks have been retrieved.");

    let sortedProjectNames: string[] = [];
    projectNames.forEach((projectName: string) => {
    if (!sortedProjectNames.includes(projectName)) {
        sortedProjectNames.push(projectName);
        }
    })

    logger.info("From REST project response", "The retrieved project names have been filtered to remove duplicates.");
    return sortedProjectNames;
};

exports.updateOrderFilter = async(filterQuery: string): Promise<void> => {
    const body: UpdateFilterBodyInterface = { "commands": [
        {"type": "filter_update", "uuid": `${uuidv4()}`, "args": {"id": `${process.env.FILTER_ORDER_ID}`, "query": `${filterQuery}`}}] };
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    await axios.post(syncAPI, body, axiosConfig).then(response => { 
        logger.info("From REST filter_update response", "The filter query has been updated."); 
    }).catch((error) => logger.error("From REST filter_update response", "There is a problem updateing the filter of the account."));
};