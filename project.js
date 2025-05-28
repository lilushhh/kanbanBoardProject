document.addEventListener("DOMContentLoaded", () => {
    const projectName = localStorage.getItem("currentProject");
    if (projectName) {
        const title = document.getElementById("boardTitle");
        title.textContent = `${projectName} - Kanban Board`;
    } else {
        document.getElementById("boardTitle").textContent = "Untitled Project - Kanban Board";
    }

    const projectKey = "tasks_" + projectName;
    const tasks = JSON.parse(localStorage.getItem(projectKey)) || [];

    tasks.forEach(task => renderTask(task.text, task.status));

    updateTaskCounts();
});


function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    if (!taskText) return;

    const projectName = localStorage.getItem("currentProject");
    const projectKey = "tasks_" + projectName;

    let raw = localStorage.getItem(projectKey);
    let tasks = raw ? JSON.parse(raw) : [];

    tasks.push({ text: taskText, status: "todo" });
    localStorage.setItem(projectKey, JSON.stringify(tasks));

    renderTask(taskText, "todo");

    input.value = "";
}

function renderTask(text, status) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("draggable", "true");

    task.innerHTML = `
        <span>${text}</span>
        <i class = "fas fa-trash delete-icon" onclick="deleteTask(this)"></i>
    `;

    const column = document.querySelector(`#${status} .tasks`);
    column.appendChild(task);

    updateTaskCounts();
}

function updateTaskCounts() {
    const todoCount = document.querySelectorAll("#todo .task").length;
    const inProgressCount = document.querySelectorAll("#inProgress .task").length;
    const doneCount = document.querySelectorAll("#done .task").length;

    document.getElementById("todoTitle").textContent = `TO DO (${todoCount})`;
    document.getElementById("inProgressTitle").textContent = `IN PROGRESS (${inProgressCount})`;
    document.getElementById("doneTitle").textContent = `DONE (${doneCount})`;
}

function deleteTask(icon) {
    const task = icon.parentElement;
    const taskText = task.querySelector("span").textContent;

    task.remove();

    const projectName = localStorage.getItem("currentProject");
    const projectKey = "tasks_" + projectName;

    let tasks = JSON.parse(localStorage.getItem(projectKey) || []);
    tasks = tasks.filter(task => task.text !== taskText);

    localStorage.setItem(projectKey, JSON.stringify(tasks));

    updateTaskCounts();
}

function goBack() {
    window.location.href = "index.html";
}