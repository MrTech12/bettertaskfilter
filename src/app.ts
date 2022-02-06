require("dotenv").config();
const TodoistProvider = require('./Helpers/TodoistProvider');
const FilterHelper = require('./Helpers/FilterHelper');
const DiscordHelper = require('./helpers/DiscordHelper');
import logger = require('npmlog');

function updateFilter (): void {
    if (process.env.TODOIST_TOKEN === "" || process.env.DISCORD_TOKEN === "" || process.env.TODOIST_TOKEN === undefined || process.env.DISCORD_TOKEN === undefined) {
        logger.error("From Setup","The tokens for Todoist & Discord are not available.");
        process.exit(1);
    }
    
    logger.info("From Setup","The tokens are available. The application is starting...");
    TodoistProvider.retrieveFilters().then((filters: FilterInterface[]) => {
        let bucketFilter = filters.find(filter => filter.id == process.env.FILTER_BUCKET_ID);
    
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