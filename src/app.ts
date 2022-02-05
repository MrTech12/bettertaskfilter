require("dotenv").config();
const TodoistProvider = require('./Helpers/TodoistProvider');
const FilterHelper = require('./Helpers/FilterHelper');
const DiscordHelper = require('./helpers/DiscordHelper');
import logger = require('npmlog');

if (process.env.TODOIST_TOKEN === "" || process.env.DISCORD_TOKEN === "" || process.env.TODOIST_TOKEN === undefined || process.env.DISCORD_TOKEN === undefined) {
    logger.error("From Setup","The tokens for Todoist & Discord are not available.");
    process.exit(1);
}

logger.info("From Setup","The tokens are available. The application is starting...");
TodoistProvider.retrieveFilters().then((filters: FilterInterface[]) => {
    let filterBucket = filters.find(filter => filter.id == process.env.FILTER_BUCKET_ID);

    TodoistProvider.retrieveTasks(filterBucket).then((tasks: TaskInterface[]) => {
        TodoistProvider.retrieveProjectNames(tasks).then((retrievedProjectNames:string[]) => {
            let projectNames: string[] = [];
            projectNames = [...retrievedProjectNames];

            let filterQuery = FilterHelper.createFilter(projectNames);

            TodoistProvider.updateOrderFilter(filterQuery).then(() => {
                DiscordHelper.sendStatusMessage();
                logger.info("From Setup","The application is finished.");
            });
        });
    });
});

