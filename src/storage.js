import { lists } from "./todo-list";
import { Project } from "./project";
import { Item } from "./todo-item";

const storage = (() => {

    const setStorage = () => {
        localStorage.setItem("list", JSON.stringify(lists.getProjects()));
    }

    const getStorage = () => {
        // get item
        let item = localStorage.getItem("list");

        if (item != null)
        {
            // set projects
            lists.setProjects(JSON.parse(item));

            let projects = lists.getProjects();
            for (let i = 0; i < projects.length; i++)
            {
                // create new project for everything 
                let project = Project(projects[i].name);

                // create todo items for everything
                for (let j = 0; j < projects[i].todos.length; j++)
                {
                    project.addTodo(Object.assign(new Item(), projects[i].todos[j]));
                }
                lists.setProject(project, i);
            }
            
        }
        else
        {
            // default project if nothing in local storage
            lists.addProject("Miscellaneous");
        } 
    }

    return {
        setStorage,
        getStorage
    }
})();

export {storage};