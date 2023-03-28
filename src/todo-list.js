import { Project } from "./project";

const lists = (() => 
{
    let projects = [];

    const addProject = (project) => {

        if (getProject(project) === null)
        {
            projects.push(Project(project));
        }
        else
        {
            alert("Projects must have different names!");
        }


    }

    const removeProject = (name) => {
        let index = getProjectIndex(name);
        projects.splice(index, 1);
    }

    const getProject = (name) => {
        let project = projects.filter(project => project.getName() === name);
        if (project.length > 0)
        {
            return project[0];
        }
        else return null;
    }

    const getProjectIndex = (name) => {

        for (let i = 0; i < projects.length; i++)
        {
            if (projects[i].getName() === name)
            {
                return i;
            }
        }
        return -1;
        
    }

    const getAllProjects = () => {
        return projects;
    }

    return {
        addProject,
        removeProject,
        getProject,
        getAllProjects
    }

})();

export {lists}