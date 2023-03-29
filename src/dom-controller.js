import { lists } from "./todo-list";
import { Project } from "./project";
import { listController } from "./list-controller";
import { Item } from "./todo-item";
import { storage } from "./storage";

const domController = (() => {

    let body = document.querySelector('body');

    // DOM RENDERING
    const initializeDom = () => {

        // get storage 
        storage.getStorage();

        // develop layouts
        createDivLayout();
        developHeader();
        developSidebar();

        // render DOM
        renderDom(lists.getProjects().length > 0 ? lists.getProjects()[0].name : null);

        // initialize add form
        createAddForm();

    }

    const renderDom = (projectName) => {

        // if no projects currently exist
        if (projectName === null)
        {
            document.querySelector('.main').textContent = "Add a Todo now!";
        }

        else
        {
            // edit visibility
            let mainContent = document.querySelector(".main-content");
            mainContent.style['visibility'] = 'visible';
    
            let todoForm = document.querySelector('.add-todo')
            todoForm.style['visibility'] = 'hidden';
    
            let projectForm = document.querySelector('.add-project')
            projectForm.style['visibility'] = 'hidden';
    
            // fix sidebar and todos
            developSidebar();
            renderProjectTodos(projectName);
        }

        // set storage as storage will always need to get set if DOM is being rendered
        storage.setStorage();

    }

    const renderProjectTodos = (project) => {
        let todos = lists.getProject(project).getTodos();
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
            title.textContent = todos[i].title;

            left.appendChild(checkbox);
            left.appendChild(title);

            let right = createDiv('right');

            let date = document.createElement('p');
            date.textContent = todos[i].dueDate;

            let detailsButton = document.createElement('button');
            detailsButton.textContent = "Show Details";
            detailsButton.addEventListener('click', () => {
                populateDetailsDiv(todos[i]);
            })

            let deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('delete');
            deleteButton.addEventListener('click', () => {
                lists.getProject(project).removeTodo(todos[i].title);
                storage.setStorage();
                renderProjectTodos(project);
            })

            right.appendChild(date);
            right.appendChild(detailsButton);
            right.appendChild(deleteButton);

            div.appendChild(left);
            div.appendChild(right);

            if (todos[i].completed)
            {
                checkbox.checked = true;
                div.style['opacity'] = '50%';
            }
            let priority = todos[i].priority;
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
                    todos[i].completed = true;
                }
                else todos[i].completed = false;
                storage.setStorage();
                renderProjectTodos(project);
            });


            ul.appendChild(div);
        }

        main.appendChild(title);
        main.appendChild(ul);
    }

    // INITIALIZE LAYOUT
    const createDivLayout = () => {

        // header
        body.appendChild(createDiv("header"));

        // sidebar and todos
        let mainContent = createDiv("main-content");
        mainContent.appendChild(createDiv("sidebar"));
        mainContent.appendChild(createDiv("main"));
        body.appendChild(mainContent);

        // forms/popups
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

        // reset content
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

    // helper method to create project links for sidebar
    const createSidebarProjects = () => {

        // create ul for all projects
        let projectUL = document.createElement('ul');
        projectUL.classList.add("sidebar-projects");

        // add each project to ul
        let projects = lists.getProjects();
        for (let i = 0; i < projects.length; i++)
        {
            let li = document.createElement('li');

            // create button to click on project
            let proj = document.createElement('button');
            proj.classList.add('sidebar-project');
            proj.textContent = projects[i].name;

            //  create x button to delete project
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'X';

            // event listener
            deleteButton.addEventListener('click', () => {
                
                // remove projects and fix sidebar
                lists.removeProject(projects[i].name);
                developSidebar();
                
                // render DOM as necessary
                let renderDomProject = lists.getProjects().length != 0 ? lists.getProjects()[0].name : null;
                renderDom(renderDomProject);

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

            // event listener for project button
            proj.addEventListener('click', () => renderProjectTodos(projects[i].name));
        }
        return projectUL;
    }

    // LISTENERS
    const addTodoListener = () => {
       
        // fix visibility
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'hidden';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'visible';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';
    }

    const newTodoCancelListener = () => {

        // fix dom in case new projects added
        renderDom();

        // fix visibility
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'visible';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'hidden';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';
        
    }

    const newTodoSubmitListener = (e) => {
        e.preventDefault();

        // fix visibility
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
        listController.addTodo(new Item(name, description, date, priority, false, project));

        // reset form and render dom
        resetAddFormFields();
        renderDom(project);
    }

    const projectButtonListener = () => {

        // fix visibility
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'hidden';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'hidden';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'visible';
    }

    const newProjectCancelListener = () => {

        // fix visibility
        let mainContent = document.querySelector(".main-content");
        mainContent.style['visibility'] = 'hidden';

        let todoForm = document.querySelector('.add-todo')
        todoForm.style['visibility'] = 'visible';

        let projectForm = document.querySelector('.add-project')
        projectForm.style['visibility'] = 'hidden';
    }

    const newProjectFormListener = (e) => {
        e.preventDefault();

        // fix visibility
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
        storage.setStorage();
    }

    // FORM METHODS
    const createAddForm = () => {
        
        // create form
        let form = document.createElement('form');
        form.classList.add('add-todo-form');
        form.classList.add('popup');

        // create HTML Elements
        let title = document.createElement('p');
        title.textContent = "Add a Todo";
        title.classList.add("title");

        let ul = document.createElement('ul');
        ul.classList.add("add-todo-form-ul");

        // name, description, date
        ul.appendChild(createFormInput('name', 'text', "Name"));
        ul.appendChild(createFormInput('description', 'textarea', "Description"));
        ul.appendChild(createFormInput('date', 'date', "Due Date"));

        // create structure for priority input
        let priorityInput = document.createElement('div');
        priorityInput.textContent = "Priority";
        priorityInput.classList.add("priority-input");

        let priorityUL = document.createElement('ul');
        priorityUL.classList.add("priority-input-ul");

        // add priority selection options
        priorityUL.appendChild(createFormInput('priority', 'radio', "Low"));
        priorityUL.appendChild(createFormInput('priority', 'radio', "Medium"));
        priorityUL.appendChild(createFormInput('priority', 'radio', "High"));

        priorityInput.appendChild(priorityUL);
        ul.appendChild(priorityInput);

        // create dropdown for project selection
        let projectDropdown = createProjectDropdown();
        ul.appendChild(projectDropdown);

        // create div for buttons
        let buttons = document.createElement('div');
        buttons.classList.add("buttons");

        // cancel button
        let cancelButton = document.createElement('button');
        cancelButton.textContent = "Cancel";
        cancelButton.setAttribute('type', 'button');
        cancelButton.addEventListener('click', newTodoCancelListener);

        // add new project button
        let projectButton = document.createElement('button');
        projectButton.textContent = "Add New Project";
        projectButton.setAttribute('type', 'button');
        projectButton.addEventListener('click', projectButtonListener);

        // submit button
        let submitButton = document.createElement('button');
        submitButton.textContent = "Submit";
        submitButton.setAttribute('type', 'submit');

        buttons.appendChild(cancelButton);
        buttons.appendChild(projectButton);
        buttons.appendChild(submitButton);
        
        form.appendChild(title);
        form.appendChild(ul);
        form.appendChild(buttons);

        // add this form to the div
        let addTodoForm = document.querySelector('.add-todo');
        addTodoForm.innerHTML = "";
        addTodoForm.appendChild(form);
        document.querySelector('.add-project').appendChild(createNewProjectForm());

        // form event listener
        form.addEventListener('submit', (e) => newTodoSubmitListener(e));
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
        let projectList = lists.getProjects();
        for (let i = 0; i < projectList.length; i++)
        {
            let option = document.createElement("option");
            option.setAttribute('value', projectList[i].name);
            option.textContent = projectList[i].name;
            select.appendChild(option);
        }

        // append to li
        let li = document.createElement('li');
        li.appendChild(label);
        li.appendChild(select);
        li.classList.add("project-dropdown");
        return li;
    }

    const createNewProjectForm = () => {

        // create structure
        let form = document.createElement('form');
        form.classList.add('popup');

        let title = document.createElement('p');
        title.textContent = "Add Project";
        title.classList.add("title");

        // name input
        let ul = document.createElement('ul');
        ul.appendChild(createFormInput('new-project', 'text', "Name"))

        // buttons div
        let buttons = document.createElement('div');
        buttons.classList.add("buttons");

        // cancel button
        let cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.setAttribute('type', 'button');
        cancelButton.addEventListener('click', newProjectCancelListener);

        // add button
        let addButton = document.createElement('button');
        addButton.textContent = "Add Project";
        addButton.setAttribute('type', 'submit');

        buttons.appendChild(cancelButton);
        buttons.appendChild(addButton);

        form.appendChild(title);
        form.appendChild(ul);
        form.appendChild(buttons);

        // event listener
        form.addEventListener('submit', (e) => newProjectFormListener(e));

        return form;
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

    // helper method for creating input fields
    const createFormInput = (name, type, labelText) => {

        // label
        let label = document.createElement('label');
        label.textContent = labelText;
        label.setAttribute('for', name);

        // input fields/attributes
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


        // create li with elements
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

    // MISC METHODS
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

    const populateDetailsDiv = (item) => {

        // create structure of div and fix visibility
        let div = document.querySelector('.show-details');
        div.classList.add("popup");
        div.innerHTML = "";
        div.style['visibility'] = 'visible';

        let mainContent = document.querySelector('.main-content');
        mainContent.style['opacity'] = '50%'

        let title = document.createElement('p');
        title.classList.add('title');
        title.textContent = "Details";

        // create ul of info
        let infoUL = document.createElement('ul');
        infoUL.appendChild(creatInfoLi("Name", item.title));
        infoUL.appendChild(creatInfoLi("Description", item.description));
        infoUL.appendChild(creatInfoLi("Due Date", item.dueDate));
        infoUL.appendChild(creatInfoLi("Project", item.project));

        // close button
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

        // create li for details popup
        let li = document.createElement('li');
        let title = document.createElement('div');
        title.textContent = name + ": ";

        let content = document.createElement('div');
        content.textContent = value;

        li.appendChild(title);
        li.appendChild(content);
        
        return li;
    }

    return {initializeDom};
})();

export {domController};