interface UpdateFilterBodyInterface { 
    commands: [{
        type: string,
        uuid: string, 
        args: {
            id: string | number,
            query: string
        }
    }] 
}