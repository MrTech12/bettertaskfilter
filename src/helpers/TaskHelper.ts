import * as TodoistService from '../services/TodoistService';

export async function getTasks(bucketFilter: FilterInterface): Promise<TaskInterface[]> {
    return await TodoistService.retrieveTasks(bucketFilter);
}