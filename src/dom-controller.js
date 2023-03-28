import { lists } from "./todo-list";
import { Project } from "./project";
import { listController } from "./list-controller";
import { Item } from "./todo-item";

const domController = (() => {

    let body = document.querySelector('body');

    const initializeDom = () => {
        createDivLayout();
        developHeader();
        developSidebar();
        createAddForm();

    }

    const renderDom = (projectName) => {
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'visible';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'hidden';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';

        developSidebar();
        renderProjectTodos(projectName);
    }

    // INITIALIZE LAYOUT
    const createDivLayout = () => {

        body.appendChild(createDiv("header"));

        let mainContent = createDiv("main-content");
        mainContent.appendChild(createDiv("sidebar"));
        mainContent.appendChild(createDiv("main"));

        body.appendChild(mainContent);
        body.appendChild(createDiv("add-todo"));
        body.appendChild(createDiv("add-project"));
        body.appendChild(createDiv("show-details"));
    }

    const createDiv = (name) => {
        let div = document.createElement('div');
        div.classList.add(name);

        return div;
    }

    // INITIALIZE HEADER
    const developHeader = () => {
        let headerDiv = document.querySelector(".header");
        headerDiv.textContent = "To Do List";
    }

    // INITIALIZE SIDEBAR
    const developSidebar = () => {

        let sidebarDiv = document.querySelector(".sidebar");
        sidebarDiv.innerHTML = "";

        // title
        let title = document.createElement('div');
        title.classList.add('title');
        title.textContent = "Projects";

        // create project links
        let projectUL = createSidebarProjects();

        // add button
        let addButton = document.createElement("button");
        addButton.textContent = "Add Todo";
        addButton.addEventListener('click', addTodoListener);

        sidebarDiv.appendChild(title);
        sidebarDiv.appendChild(projectUL);
        sidebarDiv.appendChild(addButton);

    }

    const createSidebarProjects = () => {

        // create ul for all projects
        let projectUL = document.createElement('ul');
        projectUL.classList.add("sidebar-projects");

        // add each project to ul
        let projects = lists.getAllProjects();
        for (let i = 0; i < projects.length; i++)
        {
            let li = document.createElement('li');

            // create button to click on project
            let proj = document.createElement('button');
            proj.classList.add('sidebar-project');
            proj.textContent = projects[i].getName();

            //  create x button to delete project
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'X';

            deleteButton.addEventListener('click', () => {
                lists.removeProject(projects[i].getName());
                developSidebar();
                
                if (lists.getAllProjects().length != 0)
                {
                    renderDom(lists.getAllProjects()[0].getName());
                }
                else
                {
                    document.querySelector('.main').innerHTML = "Add a Todo now!";
                }

                // remove previous project dropdown
                let prevDropdown = document.querySelector('.project-dropdown');
                prevDropdown.remove();

                // create new dropdown
                let ul = document.querySelector(".add-todo-form-ul");
                ul.appendChild(createProjectDropdown());
            })

            li.appendChild(proj);
            li.appendChild(deleteButton);
            projectUL.appendChild(li);


            

            proj.addEventListener('click', () => renderProjectTodos(projects[i].getName()));
        }
        return projectUL;
    }


    const addTodoListener = () => {
        
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'hidden';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'visible';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';
    }

    // FORM METHODS
    const createAddForm = () => {
        let form = document.createElement('form');
        form.classList.add('add-todo-form');
        form.classList.add('popup');

        let title = document.createElement('p');
        title.textContent = "Add a Todo";
        title.classList.add("title");

        let ul = document.createElement('ul');
        ul.classList.add("add-todo-form-ul");

        // name, description, date
        ul.appendChild(createFormInput('name', 'text', "Name"));
        ul.appendChild(createFormInput('description', 'textarea', "Description"));
        ul.appendChild(createFormInput('date', 'date', "Due Date"));

        let priorityInput = document.createElement('div');
        priorityInput.textContent = "Priority";
        priorityInput.classList.add("priority-input");

        let priorityUL = document.createElement('ul');
        priorityUL.classList.add("priority-input-ul");

        // priority selection
        priorityUL.appendChild(createFormInput('priority', 'radio', "Low"));
        priorityUL.appendChild(createFormInput('priority', 'radio', "Medium"));
        priorityUL.appendChild(createFormInput('priority', 'radio', "High"));

        priorityInput.appendChild(priorityUL);

        ul.appendChild(priorityInput);


        let projectDropdown = createProjectDropdown();
        ul.appendChild(projectDropdown);

        let buttons = document.createElement('div');
        buttons.classList.add("buttons");

        let cancelButton = document.createElement('button');
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener('click', newTodoCancelListener);
        cancelButton.setAttribute('type', 'button');

        // add new project button
        let projectButton = document.createElement('button');
        projectButton.textContent = "Add New Project";
        projectButton.setAttribute('type', 'button');
        projectButton.addEventListener('click', projectButtonListener);

        // button
        let button = document.createElement('button');
        button.textContent = "Submit";
        button.setAttribute('type', 'submit');

        buttons.appendChild(cancelButton);
        buttons.appendChild(projectButton);
        buttons.appendChild(button);
        
        form.appendChild(title);
        form.appendChild(ul);
        form.appendChild(buttons);

        let addTodoForm = document.querySelector('.add-todo');
        addTodoForm.innerHTML = "";
        addTodoForm.appendChild(form);
        document.querySelector('.add-project').appendChild(createNewProjectFrom());

        // form event listener
        form.addEventListener('submit', (e) => formEventListener(e));
    }

    const newTodoCancelListener = () => {

        renderDom();
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'visible';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'hidden';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';
        
    }

    const createNewProjectFrom = () => {
        let form = document.createElement('form');
        form.classList.add('popup');

        let title = document.createElement('p');
        title.textContent = "Add Project";
        title.classList.add("title");

        let ul = document.createElement('ul');
        ul.appendChild(createFormInput('new-project', 'text', "Name"))

        let buttons = document.createElement('div');
        buttons.classList.add("buttons");

        let cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.setAttribute('type', 'button');
        cancelButton.addEventListener('click', newProjectCancelListener);

        let addButton = document.createElement('button');
        addButton.textContent = "Add Project";
        addButton.setAttribute('type', 'submit');

        buttons.appendChild(cancelButton);
        buttons.appendChild(addButton);

        form.appendChild(title);
        form.appendChild(ul);
        form.appendChild(buttons);

        form.addEventListener('submit', (e) => newProjectFormListener(e));

        return form;
    }

    const newProjectCancelListener = () => {
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'hidden';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'visible';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';
    }

    const newProjectFormListener = (e) => {
        e.preventDefault();

        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'hidden';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'visible';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';

        // fix dropdown options

        // get text value
        let inputValue = document.querySelector("#new-project").value;
        lists.addProject(inputValue);

        // remove previous project dropdown
        let prevDropdown = document.querySelector('.project-dropdown');
        prevDropdown.remove();

        // create new dropdown
        let ul = document.querySelector(".add-todo-form-ul");
        ul.appendChild(createProjectDropdown());

        resetProjectFormFields();
    }

    const resetProjectFormFields = () => {
        document.querySelector("#new-project").value = "";
    }

    const resetAddFormFields = () => {
        document.querySelector("#name").value = "";
        document.querySelector("#description").value = "";
        document.querySelector("#date").value = "";
        document.querySelector("#project").value = "";
        getPriorityValue().checked = false;

    }
    const createProjectDropdown = () => {

        // project dropdown
        let label = document.createElement('label');
        label.setAttribute('for', 'project');
        label.textContent = "Project";

        let select = document.createElement('select');
        select.setAttribute('name', 'project');
        select.setAttribute('id', 'project');
        select.setAttribute('required', true);

        // create options
        let projectList = lists.getAllProjects();
        for (let i = 0; i < projectList.length; i++)
        {
            // console.log(projectList[i].getName());
            let option = document.createElement("option");
            option.setAttribute('value', projectList[i].getName());
            option.textContent = projectList[i].getName();
            select.appendChild(option);
        }

        let li = document.createElement('li');
        li.appendChild(label);
        li.appendChild(select);
        li.classList.add("project-dropdown");
        return li;
    }

    const projectButtonListener = () => {
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'hidden';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'hidden';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'visible';
    }

    const formEventListener = (e) => {
        e.preventDefault();

        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'visible';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'hidden';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';

        // get all input values
        let name = document.querySelector("#name").value;
        let description = document.querySelector("#description").value;
        let date = document.querySelector("#date").value;
        let priority = getPriorityValue().value;
        let project = document.querySelector("#project").value;

        // create new item
        listController.addTodo(Item(name, description, date, priority, project));
        resetAddFormFields();
        renderDom(project);
    }

    const getPriorityValue = () => {
        let priority = document.getElementsByName("priority");
        for (let i = 0; i < priority.length; i++)
        {
            if (priority[i].checked)
            {
                return priority[i];
            }
        }
    }

    const renderProjectTodos = (project) => {
        let todos = lists.getProject(project).getAllTodos();
        let main = document.querySelector('.main');
        main.innerHTML = "";
        let title = document.createElement('p');
        title.classList.add('title');
        title.textContent = project;

        let ul = document.createElement('ul');

        for (let i = 0; i < todos.length; i++)
        {
            // create div for todo
            let div = createDiv('todo-item');

            let left = createDiv('left');

            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            let title = document.createElement('p');
            title.textContent = todos[i].getTitle();

            left.appendChild(checkbox);
            left.appendChild(title);

            let right = createDiv('right');

            let date = document.createElement('p');
            date.textContent = todos[i].getDueDate();

            let detailsButton = document.createElement('button');
            detailsButton.textContent = "Show Details";
            detailsButton.addEventListener('click', () => {
                populateDetailsDiv(todos[i]);
            })

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => {
                lists.getProject(project).removeTodo(todos[i].getTitle());
                renderProjectTodos(project);
            })

            right.appendChild(date);
            right.appendChild(detailsButton);
            right.appendChild(deleteButton);

            div.appendChild(left);
            div.appendChild(right);

            if (todos[i].getCompleted())
            {
                checkbox.checked = true;
                div.style['opacity'] = '50%';
            }
            let priority = todos[i].getPriority();
            if (priority === 'Low')
            {
                div.classList.add('green');
            }
            else if (priority === 'Medium')
            {
                div.classList.add('yellow');
            }
            else div.classList.add('red');

            checkbox.addEventListener('click', () => {
                if (checkbox.checked == true)
                {
                    todos[i].setCompleted(true);
                }
                else todos[i].setCompleted(false);
                renderProjectTodos(project);
            });


            ul.appendChild(div);
        }

        main.appendChild(title);
        main.appendChild(ul);
    }

    const populateDetailsDiv = (item) => {
        let div = document.querySelector('.show-details');
        div.classList.add("popup");
        div.innerHTML = "";
        div.style['visibility'] = 'visible';

        let mainContent = document.querySelector('.main-content');
        mainContent.style['opacity'] = '50%'

        let title = document.createElement('p');
        title.classList.add('title');
        title.textContent = "Details";

        let infoUL = document.createElement('ul');
        infoUL.appendChild(creatInfoLi("Name", item.getTitle()));
        infoUL.appendChild(creatInfoLi("Description", item.getDescription()));
        infoUL.appendChild(creatInfoLi("Due Date", item.getDueDate()));
        infoUL.appendChild(creatInfoLi("Project", item.getProject()));

        let closeButton = document.createElement('button');
        closeButton.textContent = "Close";
        closeButton.addEventListener('click', () => {
            div.style['visibility'] = 'hidden';
            mainContent.style['opacity'] = '100%'
        })

        div.appendChild(title);
        div.appendChild(infoUL);
        div.appendChild(closeButton);
    }

    const creatInfoLi = (name, value) => {
        let li = document.createElement('li');
        let title = document.createElement('div');
        title.textContent = name + ": ";

        let content = document.createElement('div');
        content.textContent = value;

        li.appendChild(title);
        li.appendChild(content);
        return li;
    }

    const createFormInput = (name, type, labelText) => {

        let label = document.createElement('label');
        label.textContent = labelText;
        label.setAttribute('for', name);

        let input = document.createElement('input');
        if (type != 'radio')
        {
            input.setAttribute('id', name);
        }

        input.setAttribute('type', type);
        input.setAttribute('name', name);
        input.setAttribute('required', true);

        if (type == 'radio')
        {
            input.setAttribute('value', labelText);
        }


        let li = document.createElement('li');

        if (type === 'radio')
        {
            li.appendChild(input);
            li.appendChild(label);
        }

        else
        {
            li.appendChild(label);
            li.appendChild(input);
        }


        return li;
    }

    return {initializeDom};
})();

export {domController};