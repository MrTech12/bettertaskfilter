exports.createFilter = (projectnames: string[]): string => {
    let filterQuery: string = "";
    projectnames.forEach((projectname: string) => {
        filterQuery += '#' + projectname + `${process.env.FILTER_ORDER_QUERY}`;
    })
    filterQuery = filterQuery.slice(0, -1); // Remove the last "," from the string, otherwise the filter will not function.
    return filterQuery;
};