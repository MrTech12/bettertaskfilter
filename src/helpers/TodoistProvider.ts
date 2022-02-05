import { TodoistApi } from '@doist/todoist-api-typescript';
import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

let syncAPI = 'https://todoist.com/api/v8/sync';
let restAPITasks = 'https://api.todoist.com/rest/v1/tasks';
let restAPIProjects = 'https://api.todoist.com/rest/v1/projects';

exports.retrieveFilters = async (): Promise<FilterInterface[]> => {
    const body: FilterBodyInterface = {"sync_token": "*", "resource_types": ["filters"]}
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    let filters: FilterInterface[] = [];
    
    await axios.post(syncAPI, body, axiosConfig).then(response => {
        response.data.filters.forEach((filter: FilterInterface) => {
            if (filter.id == process.env.FILTER_BUCKET_ID || filter.id == process.env.FILTER_ORDER_ID) {
                filters.push(filter);
            }
        });
    }).catch((error) => console.log(error));
    return filters;
};

exports.retrieveTasks = async (filterQuery: FilterInterface): Promise<TaskInterface[]> => {
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    let filterBucketQuery: string = filterQuery.query.split("&").join("%26");
    let tasks: TaskInterface[] = [];
    let uri: string = `${restAPITasks}?filter=${filterBucketQuery}`;

    await axios.get(uri, axiosConfig).then(response => {
        response.data.forEach((task: TaskInterface) => { tasks.push(task); });
    }).catch((error) => console.log(error));
    return tasks;
};

exports.retrieveProjectNames = async (tasks:TaskInterface[]): Promise<string[]> => {
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };
    const api = new TodoistApi(`${process.env.TODOIST_TOKEN}`);

    let projectNames: string[] = [];
    let sortedProjectNames: string[] = [];

    for (let index = 0; index < tasks.length; index++) {
        let uri: string = `${restAPIProjects}/${tasks[index].project_id}`;

        await axios.get(uri, axiosConfig).then(response => {
            projectNames.push(response.data.name);
        }).catch((error) => console.log(error));
    }

    projectNames.forEach((projectName: string) => {
    if (!sortedProjectNames.includes(projectName)) {
        sortedProjectNames.push(projectName);
        }
    })
    return sortedProjectNames;
};

exports.updateOrderFilter = async(filterQuery: string) => {
    const body: UpdateFilterBodyInterface = { "commands": [{"type": "filter_update", "uuid": `${uuidv4()}`, "args": {"id": `${process.env.FILTER_ORDER_ID}`, "query": `${filterQuery}`}}] };
    const axiosConfig: AxiosRequestConfig = { headers: {'Authorization': `Bearer ${process.env.TODOIST_TOKEN}`} };

    await axios.post(syncAPI, body, axiosConfig).then(response => {  })
    .catch((error) => console.log(error));
};

