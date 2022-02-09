import * as TodoistProvider from './TodoistProvider';
import * as DateTimeHelper from './DateTimeHelper';
import logger from 'npmlog';

export async function getProjectNames(tasks: TaskInterface[]): Promise<string[]> {
    let projectNames: string[] = [];

    await TodoistProvider.retrieveProjectNames(tasks).then((retrievedProjectNames:string[]) => { 
        projectNames = sortProjectNames(retrievedProjectNames);
    });
    return projectNames;
}

export function sortProjectNames(projectNames: string[]) : string[] {
    let sortedProjectNames: string[] = [];

    projectNames.forEach((projectName: string) => {
        if (!sortedProjectNames.includes(projectName)) { sortedProjectNames.push(projectName) }
    })

    logger.info(`From REST project response @ ${DateTimeHelper.getDutchDateTime('short')}`, 'The retrieved project names have been filtered to remove duplicates.');
    return sortedProjectNames;
}