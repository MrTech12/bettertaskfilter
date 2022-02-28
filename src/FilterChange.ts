require('dotenv').config();
import * as TodoistService from './services/TodoistService';
import * as FilterHelper from './helpers/FilterHelper';
import * as DateTimeHelper from './helpers/DateTimeHelper';
import * as ProjectHelper from './helpers/ProjectHelper';
import * as TaskHelper from './helpers/TaskHelper';
import logger from 'npmlog';

export async function InitiateFilterChange(): Promise<void> {
    if (process.env.TODOIST_TOKEN === '' || process.env.DISCORD_TOKEN === '' || process.env.TODOIST_TOKEN === undefined || process.env.DISCORD_TOKEN === undefined) {
        logger.error(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The tokens for Todoist & Discord are not available.');
        process.exit(1);
    }
    
    logger.info(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The tokens are available. The application is starting...');
    await TodoistService.retrieveFilters()
        .then((allFilters: FilterInterface[]) => FilterHelper.findImportantFilters(allFilters))
        .then((importantFilters: FilterInterface[]) => FilterHelper.getBucketFilter(importantFilters))
        .then((bucketFilter: FilterInterface) => TaskHelper.getTasks(bucketFilter))
        .then((tasks: TaskInterface[]) => ProjectHelper.getProjectNames(tasks))
        .then((projectNames: string[]) => FilterHelper.createFilterQuery(projectNames))
        .then((newFilterQuery: string) => FilterHelper.updateFilter(newFilterQuery));
}