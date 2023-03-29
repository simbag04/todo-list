import { lists } from "./todo-list";
import { Project } from "./project";

const storage = (() => {

    const setStorage = () => {
        localStorage.setItem("list", JSON.stringify(lists.getProjects()));
    }

    const getStorage = () => {
        let item = localStorage.getItem("list");
        if (item != null)
        {
            lists.setProjects(JSON.parse(item));
            // console.log(lists.projects);
        }
        else
        {
            lists.addProject("Miscellaneous");
        } 
    }

    return {
        setStorage,
        getStorage
    }
})();

export {storage};