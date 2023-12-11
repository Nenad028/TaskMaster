document.addEventListener('DOMContentLoaded', loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('task-list').addEventListener('click', modifyTask);
document.getElementById('filters').addEventListener('click', filterTasks);

function addTask(e) {
    e.preventDefault();
    let taskValue = document.getElementById('task-input').value;
    if (taskValue.trim() !== '') {
        saveTask(taskValue);
        renderTask(taskValue);
        document.getElementById('task-input').value = '';
        updateTaskCount();
    }
}

function renderTask(taskText, completed = false) {
    let taskList = document.getElementById('task-list');
    let taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
        <span class="task-text">${taskText}</span>
        <button class="delete-task-btn">Delete</button>
    `;
    taskList.appendChild(taskItem);
}

function modifyTask(e) {
    if (e.target.classList.contains('delete-task-btn')) {
        e.target.parentElement.remove();
        updateLocalStorage();
    }
    if (e.target.type === 'checkbox') {
        updateLocalStorage();
    }
    updateTaskCount();
}

function saveTask(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push({ task, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = getTasksFromLocalStorage();
    tasks.forEach(task => renderTask(task.task, task.completed));
    updateTaskCount();
}

function getTasksFromLocalStorage() {
    let tasks = localStorage.getItem('tasks');
    if (tasks === null) {
        tasks = [];
    } else {
        tasks = JSON.parse(tasks);
    }
    return tasks;
}

function updateLocalStorage() {
    let tasks = [];
    document.querySelectorAll('.task-item').forEach(taskItem => {
        tasks.push({
            task: taskItem.querySelector('.task-text').textContent,
            completed: taskItem.querySelector('.task-checkbox').checked
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskCount() {
    let tasks = document.querySelectorAll('.task-item');
    let activeTasks = Array.from(tasks).filter(task => !task.querySelector('.task-checkbox').checked).length;
    document.getElementById('task-count').textContent = `${activeTasks} tasks left`;
}

function filterTasks(e) {
    let filter = e.target.textContent.toLowerCase();
    let tasks = document.querySelectorAll('.task-item');
    tasks.forEach(taskItem => {
        let isChecked = taskItem.querySelector('.task-checkbox').checked;
        switch (filter) {
            case 'all':
                taskItem.style.display = '';
                break;
            case 'active':
                !isChecked ? (taskItem.style.display = '') : (taskItem.style.display = 'none');
                break;
            case 'completed':
                isChecked ? (taskItem.style.display = '') : (taskItem.style.display = 'none');
                break;
        }
    });
}
