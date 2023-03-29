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

    const setProject = (project, index) => {
        projects[index] = project;
    }

    const getProject = (name) => {
        let project = projects.filter(project => project.name === name);
        if (project.length > 0)
        {
            return project[0];
        }
        else return null;
    }

    const getProjectIndex = (name) => {

        for (let i = 0; i < projects.length; i++)
        {
            if (projects[i].name === name)
            {
                return i;
            }
        }
        return -1;  
    }

    const setProjects = (newProjects) => {
        projects = newProjects;
    }

    const getProjects = () => {return projects};

    return {
        projects,
        addProject,
        removeProject,
        getProject,
        setProject,
        setProjects,
        getProjects
    }

})();

export {lists}