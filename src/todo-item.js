const Item = (title, description, dueDate, priorit, proj) => {

    let priority = priorit;
    let completed = false;
    let project = proj;

    const getTitle = () => {return title};
    const getDescription = () => {return description};
    const getDueDate = () => {return dueDate};
    const getPriority = () => {return priority};
    const getNotes = () => {return notes};
    const getCompleted = () => {return completed};
    const getProject = () => {return project};

    const setCompleted = (value) => {completed = value};

    const setPriority = (value) => {
        if (value === 'low' || value === 'high' || value === 'mid')
        {
            priority = value;
        }
    }

    const setProject = (value) => {
        project = value;
    }

    return {
        getTitle, 
        getDescription, 
        getDueDate, 
        getPriority, 
        getNotes, 
        getCompleted,
        getProject, 
        setCompleted, 
        setPriority, 
        setProject
    }
}

export {Item};