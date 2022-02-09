import * as TodoistProvider from './TodoistProvider';

export async function getTasks(bucketFilter: FilterInterface): Promise<TaskInterface[]> {
    return await TodoistProvider.retrieveTasks(bucketFilter);
}