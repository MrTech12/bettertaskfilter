import logger = require('npmlog');

exports.createFilter = (projectnames: string[]): string => {
    let filterQuery: string = "";
    projectnames.forEach((projectname: string) => {
        filterQuery += '#' + projectname + `${process.env.FILTER_ORDER_QUERY}`;
    })
    filterQuery = filterQuery.slice(0, -1); // Remove the last "," from the string, otherwise the filter will not function.
    logger.info("From Filter module", "The new filter query is created.");
    return filterQuery;
};