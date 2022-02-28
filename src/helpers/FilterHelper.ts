import logger from 'npmlog';
import * as DateTimeHelper from './DateTimeHelper';
import * as TodoistService from '../services/TodoistService';
import * as DiscordService from '../services/DiscordService';

export function findImportantFilters(allFilters: FilterInterface[]) : FilterInterface[] {
    let importantFilters: FilterInterface[] = [];

    allFilters.forEach((filter: FilterInterface) => {
        if (filter.id == process.env.FILTER_BUCKET_ID || filter.id == process.env.FILTER_ORDER_ID) { importantFilters.push(filter) }
    });
    logger.info(`From REST filter response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'The 2 filters have been retrieved.');
    return importantFilters;
}

export function getBucketFilter(filters: FilterInterface[]): FilterInterface {
    let bucketFilter = filters.find(filter => filter.id == process.env.FILTER_BUCKET_ID);

    if(bucketFilter == undefined) {
        logger.error(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The bucket filter has not been retrieved properly.');
        process.exit(1);
    }
    return bucketFilter;
}

export function createFilterQuery(projectNames: string[]): string {
    let filterQuery: string = '';

    projectNames.forEach((projectname: string) => {
        filterQuery += '#' + projectname + `${process.env.FILTER_ORDER_QUERY}`;
    })
    
    filterQuery = filterQuery.slice(0, -1); // Remove the last "," from the string, otherwise the query will not function.
    logger.info(`From Filter module @ ${DateTimeHelper.getDutchDateTime('short')}`, 'The new filter query is created.');
    return filterQuery;
};

export async function updateFilter(newFilterQuery: string): Promise<void> {
    await TodoistService.updateOrderFilter(newFilterQuery).then(async () => DiscordService.sendStatusMessage());
}