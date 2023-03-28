import { lists } from "./todo-list"
import { Project } from "./project";
import { Item } from "./todo-item";

const listController = (() => {

    const addProject = (project) => {
        lists.addProject(project);
    }

    const addTodo = (item) => {

        let project = item.getProject();
        let listProject = lists.getProject(project);
        if (lists.getProject(project) === null)
        {
            addProject(project);
            listProject = lists.getProject(project);
        }
        listProject.addTodo(item);
    }

    const finishTodo = (item) => {
        item.setCompleted(true);
    }

    return {addTodo};
})();

export {listController};