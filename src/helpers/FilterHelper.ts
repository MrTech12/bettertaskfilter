exports.createFilter = (projectnames: string[]) => {
    let filterQuery: string = "";
    projectnames.forEach((projectname: string) => {
        filterQuery += '#' + projectname + `${process.env.FILTER_QUERY}`
    })
    filterQuery = filterQuery.slice(0, -1);
    return filterQuery;
};