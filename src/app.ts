require("dotenv").config();
const TodoistProvider = require('./Helpers/TodoistProvider');
const FilterHelper = require('./Helpers/FilterHelper');

if (process.env.TODOIST_TOKEN === "" || process.env.DISCORD_TOKEN === "") {
    console.error("Tokens not found");
    process.exit(1);
}

TodoistProvider.retrieveFilters().then((filters: FilterInterface[]) => {
    let filterBucket = filters.find(filter => filter.id == process.env.FILTER_BUCKET_ID);

    TodoistProvider.retrieveTasks(filterBucket).then((tasks: TaskInterface[]) => {
        TodoistProvider.retrieveProjectNames(tasks).then((retrievedProjectNames:string[]) => {
            let projectNames: string[] = [];
            projectNames = [...retrievedProjectNames];

            let filterQuery = FilterHelper.createFilter(projectNames);

            TodoistProvider.updateOrderFilter(filterQuery).then(() => {
                console.log("done for the day");
            });
        });
    });
});