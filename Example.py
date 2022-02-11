# Python script from Michael Wille
# His article: https://mike.ps/todoist-today-by-project/

def update(request):

    # Import libraries
    import requests
    from todoist.api import TodoistAPI
    import json
    
    ## Part 1: Get the 'filter' objects
    key = "12b3456abcdefg" # Retrieve the API key with environment variables
    api = TodoistAPI(key)
    api.sync()
    filter_today = api.filters.get_by_id(2290276) # Get the 'filter bucket' object, based on the ID of the URL
    filter_today_new = api.filters.get_by_id(2344358) # Get the 'new filter' object, based on the ID of the URL

    ## Part 2: Get all the tasks, based on the 'filter bucket'
    tasks = requests.get( # Make a request to get all the tasks that are part of the filter
        "https://api.todoist.com/rest/v1/tasks",
        params={
            "filter": filter_today['query'] # Pass the 'query' element of the 'filter bucket' object as a parameter
        },
        headers={
            "Authorization": "Bearer %s" % key # Use the API key as a Bearer token.
        }).json()

    ## Part 3: Get all the 'project names' of the retrieved tasks
    proj_names = [] # Array to store the project names
    for task in tasks: # Loop through all retrieved tasks
        project_id = task['project_id'] # Get the 'project id' element from the task 
        project_name = api.projects.get_by_id(project_id)['name'] # Get the name of the project, based on the 'project id' element
        if project_name not in proj_names: # Check if the 'project name' is not part of the array
            proj_names.append(project_name) # Add the project name to the array, if it is not already part of the array

    filter_query = ""
    catch_all_query = "!("

   ## Part 4: Create a 'filter query' based on the retrieved 'project names' 
    for name in proj_names: # Loop through all project names
        filter_query = filter_query + "#" + name + "&(today|overdue|p1)&!subtask&!recurring," # Add the project name, with the query from the 'filter bucket', to a new 'filter query'
        catch_all_query = catch_all_query + "#" + name + "|"
    
    catch_all_query = catch_all_query[:-1] + ")&(today|overdue|p1)&!subtask&!recurring"
    
    if len(filter_query+catch_all_query) <= 1024: #make sure it's not too long
        filter_query = filter_query + catch_all_query
    else:
        filter_query = filter_query[:-2] #remove the ", " from the end
    
    ## Part 5: Update the 'new filter'
    filter_today_new.update(query=filter_query) # Update the 'new filter' with the newly created 'filter query' as the parameter
    api.commit()
