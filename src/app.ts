require('dotenv').config();
import * as TodoistProvider from './helpers/TodoistProvider';
import * as FilterHelper from './helpers/FilterHelper';
import * as DiscordHelper from './helpers/DiscordHelper';
import * as DateTimeHelper from './helpers/DateTimeHelper';
import logger from 'npmlog';

function updateFilter (): void {
    if (process.env.TODOIST_TOKEN === '' || process.env.DISCORD_TOKEN === '' || process.env.TODOIST_TOKEN === undefined || process.env.DISCORD_TOKEN === undefined) {
        logger.error(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The tokens for Todoist & Discord are not available.');
        process.exit(1);
    }
    
    logger.info(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The tokens are available. The application is starting...');
    TodoistProvider.retrieveFilters().then((filters: FilterInterface[]) => {
        let bucketFilter = filters.find(filter => filter.id == process.env.FILTER_BUCKET_ID);

        if(bucketFilter == undefined) {
            logger.error(`From Setup @ ${DateTimeHelper.getDutchDateTime('short')}`,'The bucket filter has not been saved properly.');
            process.exit(1);
        }
        TodoistProvider.retrieveTasks(bucketFilter).then((tasks: TaskInterface[]) => {
            TodoistProvider.retrieveProjectNames(tasks).then((retrievedProjectNames:string[]) => {
                let projectNames: string[] = [];
                projectNames = [...retrievedProjectNames];
    
                let newFilterQuery = FilterHelper.createFilterQuery(projectNames);
    
                TodoistProvider.updateOrderFilter(newFilterQuery).then(() => {
                    DiscordHelper.sendStatusMessage();
                });
            });
        });
    });
}

updateFilter();