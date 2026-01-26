let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    createAppStructure();
    renderTasks();
}

function createAppStructure() {
    const body = document.body;
    body.innerHTML = '';
    
    const container = document.createElement('div');
    container.className = 'container';
    
    const header = document.createElement('div');
    header.className = 'header';
    
    const title = document.createElement('h1');
    title.className = 'title';
    title.textContent = 'To-Do List';
    header.appendChild(title);
    
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';
    
    const form = document.createElement('form');
    form.id = 'task-form';
    
    const inputGroup1 = document.createElement('div');
    inputGroup1.className = 'input-group';
    
    const label1 = document.createElement('label');
    label1.className = 'label';
    label1.textContent = 'Task';
    inputGroup1.appendChild(label1);
    
    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.id = 'task-input';
    taskInput.className = 'input';
    taskInput.placeholder = 'Enter task';
    inputGroup1.appendChild(taskInput);
    
    form.appendChild(inputGroup1);
    
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'button';
    submitButton.textContent = 'Add Task';
    form.appendChild(submitButton);
    
    formContainer.appendChild(form);
    
    const controls = document.createElement('div');
    controls.className = 'controls';
    
    const filterAll = document.createElement('button');
    filterAll.className = 'button';
    filterAll.id = 'filter-all';
    filterAll.textContent = 'All';
    controls.appendChild(filterAll);
    
    const filterActive = document.createElement('button');
    filterActive.className = 'button';
    filterActive.id = 'filter-active';
    filterActive.textContent = 'Active';
    controls.appendChild(filterActive);
    
    const filterCompleted = document.createElement('button');
    filterCompleted.className = 'button';
    filterCompleted.id = 'filter-completed';
    filterCompleted.textContent = 'Completed';
    controls.appendChild(filterCompleted);
    
    const sortButton = document.createElement('button');
    sortButton.className = 'button';
    sortButton.id = 'sort-button';
    sortButton.textContent = 'Sort by Date';
    controls.appendChild(sortButton);
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchInput.className = 'control-input';
    searchInput.placeholder = 'Search tasks...';
    controls.appendChild(searchInput);
    
    const taskList = document.createElement('ul');
    taskList.id = 'task-list';
    taskList.className = 'task-list';
    
    container.appendChild(header);
    container.appendChild(formContainer);
    container.appendChild(controls);
    container.appendChild(taskList);
    body.appendChild(container);
    
    setupEventListeners();
}

function setupEventListeners() {
    document.getElementById('task-form').addEventListener('submit', addTask);
    document.getElementById('filter-all').addEventListener('click', () => filterTasks('all'));
    document.getElementById('filter-active').addEventListener('click', () => filterTasks('active'));
    document.getElementById('filter-completed').addEventListener('click', () => filterTasks('completed'));
    document.getElementById('sort-button').addEventListener('click', sortTasks);
    document.getElementById('search-input').addEventListener('input', handleSearch);
}

function addTask(e) {
    e.preventDefault();
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    
    if (text) {
        const newTask = {
            id: taskIdCounter++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        input.value = '';
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    // -
}