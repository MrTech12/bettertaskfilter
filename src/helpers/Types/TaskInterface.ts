interface TaskInterface {
    id: number,
    assigner: number,
    assignee: number | undefined
    project_id: number,
    section_id: number,
    parent_id: number | undefined,
    order: number,
    content: string,
    description: string,
    completed: boolean,
    label_ids: number[],
    priority: number,
    comment_count: number,
    creator: number,
    created: string,
    due: {
        recurring: boolean, 
        string: string, 
        date: string,
        datetime: string | undefined,
        timezone: string | undefined
    },
    url: string
}