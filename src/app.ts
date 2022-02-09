require('dotenv').config();
import * as TodoistProvider from './helpers/TodoistProvider';
import * as FilterHelper from './helpers/FilterHelper';
import * as DiscordHelper from './helpers/DiscordHelper';
import * as DateTimeHelper from './helpers/DateTimeHelper';
import logger from 'npmlog';

async function InitiateApp (): Promise<void> {
    if (process.env.TODOIST_TOKEN === '' || process.env.DISCORD_TOKEN === '' || process.env.TODOIST_TOKEN === undefined || process.env.DISCORD_TOKEN === undefined) {
        logger.error(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The tokens for Todoist & Discord are not available.');
        process.exit(1);
    }
    
    logger.info(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The tokens are available. The application is starting...');
    await TodoistProvider.retrieveFilters()
        .then((filterResult: FilterInterface[]) => getBucketFilter(filterResult))
        .then((bucketFilter: FilterInterface) => getTasks(bucketFilter))
        .then((tasks: TaskInterface[]) => getFilterQuery(tasks))
        .then((newFilterQuery: string) => updateFilter(newFilterQuery));
}

function getBucketFilter(filters: FilterInterface[]): FilterInterface {
    let bucketFilter = filters.find(filter => filter.id == process.env.FILTER_BUCKET_ID);

    if(bucketFilter == undefined) {
        logger.error(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The bucket filter has not been retrieved properly.');
        process.exit(1);
    }
    return bucketFilter;
}

async function getTasks(bucketFilter: FilterInterface): Promise<TaskInterface[]> {
    return await TodoistProvider.retrieveTasks(bucketFilter);
}

async function getFilterQuery(tasks: TaskInterface[]): Promise<string> {
    let filterquery: string = '';

    await TodoistProvider.retrieveProjectNames(tasks).then((retrievedProjectNames:string[]) => { 
        let projectNames: string[] = [];
        projectNames = [...retrievedProjectNames];

        filterquery = FilterHelper.createFilterQuery(projectNames);
    });
    return filterquery;
}

async function updateFilter(newFilterQuery: string): Promise<void> {
    await TodoistProvider.updateOrderFilter(newFilterQuery).then(async () => DiscordHelper.sendStatusMessage());
}

InitiateApp();