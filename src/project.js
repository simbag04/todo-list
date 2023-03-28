import { Item } from "./todo-item";
const Project = (name) => {

    const todos = [];
    const getName = () => {return name};

    const addTodo = (item) => 
    {
        if (getTodoIndex(item.getTitle()) == -1)
        {
            todos.push(item);
        }
        else
        {
            alert("Todos must have different names!");
        }

    }

    const getTodoIndex = (name) => {
        for (let i = 0; i < todos.length; i++)
        {
            if (todos[i].getTitle() === name)
            {
                return i;
            }
        }
        return -1;
    }

    const removeTodo = (name) => {
        let index = getTodoIndex(name);
        todos.splice(index, 1);
    }
    const getAllTodos = () => { return todos};

    return {
        getName,
        addTodo,
        removeTodo,
        getAllTodos
    }
}

export {Project};