let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let taskIdCounter = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
let currentFilter = 'all';
let searchTerm = '';

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    createAppStructure();
    renderTasks();
    setupDragAndDrop();
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

function setupDragAndDrop() {
    const taskList = document.getElementById('task-list');
    
    let draggedItem = null;
    
    taskList.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('drag-handle')) {
            draggedItem = e.target.closest('.task-item');
            setTimeout(() => {
                draggedItem.classList.add('dragging');
            }, 0);
        }
    });
    
    taskList.addEventListener('dragend', () => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
        }
    });
    
    taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (draggable) {
            if (afterElement == null) {
                taskList.appendChild(draggable);
            } else {
                taskList.insertBefore(draggable, afterElement);
            }
        }
    });
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
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

function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
}

function sortTasks() {
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    saveTasks();
    renderTasks();
}

function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        const matchesFilter = currentFilter === 'all' ||
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed);
            
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        
        return matchesFilter && matchesSearch;
    });
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;
        li.draggable = true;
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        const taskText = document.createElement('div');
        taskText.className = 'task-text';
        taskText.textContent = task.text;
        taskContent.appendChild(taskText);
        
        const actions = document.createElement('div');
        actions.className = 'task-actions';
        
        const toggleButton = document.createElement('button');
        toggleButton.className = 'action-button toggle-button';
        toggleButton.textContent = task.completed ? 'Undo' : 'Done';
        toggleButton.addEventListener('click', () => toggleTask(task.id));
        actions.appendChild(toggleButton);
        
        const editButton = document.createElement('button');
        editButton.className = 'action-button edit-button';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(task.id));
        actions.appendChild(editButton);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'action-button delete-button';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));
        actions.appendChild(deleteButton);
        
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '☰';
        dragHandle.draggable = true;
        
        li.appendChild(dragHandle);
        li.appendChild(taskContent);
        li.appendChild(actions);
        
        taskList.appendChild(li);
    });
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}