require("dotenv").config();
const TodoistProvider = require('./TodoistProvider');
const FiterHelper = require('./helpers/FilterHelper');

if (process.env.TODOIST_TOKEN === null) {
    console.error("Tokens not found");
    process.exitCode = 1;
}

TodoistProvider.retrieveFilters().then((filters: any[]) => {
    let filterBucket = filters.find(filter => filter.id == process.env.FILTER_BUCKET);
    TodoistProvider.retrieveTasks(filterBucket).then((tasks: any[]) => {
        let projectNames: string[] = [];
        TodoistProvider.retrieveProjectNames(tasks).then((retrievedProjectNames:string[]) => {
            projectNames = [...retrievedProjectNames];

            let filterQuery = FiterHelper.createFilter(projectNames);

            TodoistProvider.updateOrderFilter(filterQuery).then(() => {
                console.log("done for the day");
            });
        });
    });
});