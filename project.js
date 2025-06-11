document.addEventListener("DOMContentLoaded", () => {
    const projectName = localStorage.getItem("currentProject");
    if (projectName) {
        const title = document.getElementById("boardTitle");
        title.textContent = `${projectName} - Kanban Board`;
    } else {
        document.getElementById("boardTitle").textContent = "Untitled Project - Kanban Board";
    }

    const projectKey = "tasks_" + projectName;
    const tasks = JSON.parse(localStorage.getItem(projectKey) || "[]");

    tasks.forEach(task => renderTask(task.text, task.status, task.name));
    filterByName();

    document.getElementById("filterOptions").addEventListener("change", filterTaskByUser);

    const dropZones = document.querySelectorAll(".tasks");

    dropZones.forEach(zone => {
        zone.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        zone.addEventListener("drop", (e) => {
            e.preventDefault();

            const text = e.dataTransfer.getData("text/plain");
            const oldStatus = e.dataTransfer.getData("status");
            const newStatus = zone.parentElement.id;
            const nameTask = e.dataTransfer.getData("name");

            const oldColumn = document.querySelector(`#${oldStatus} .tasks`);
            const taskToMove = [...oldColumn.children].find(el => {
                const span = el.querySelector("span");
                return span && span.textContent === `${text} - ${nameTask}`;
            });

            if (taskToMove) {
                zone.appendChild(taskToMove);
            }

            const projectKey = "tasks_" + localStorage.getItem("currentProject");
            let tasks = JSON.parse(localStorage.getItem(projectKey) || "[]");

            tasks = tasks.map(task =>
                `${task.text} - ${task.name}` === `${text} - ${nameTask}` ? {...task, status: newStatus } :
                task
            );

            localStorage.setItem(projectKey, JSON.stringify(tasks));
            updateTaskCounts();
        });
    });
});

function filterTaskByUser() {
    const selectedUser = document.getElementById("filterOptions").value;

    const projectName = localStorage.getItem("currentProject");
    const projectKey = "tasks_" + projectName;
    const tasks = JSON.parse(localStorage.getItem(projectKey) || []);

    document.querySelectorAll(".tasks").forEach(zone => {
        zone.innerHTML = "";
    });

    const filteredTasks = selectedUser === "All" ? tasks : tasks.filter(task => task.name === selectedUser);
    filteredTasks.forEach(task => {
        renderTask(task.text, task.status, task.name);
    });

    updateTaskCounts();
}

function filterByName() {
    const select = document.getElementById("filterOptions");

    select.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "All";
    allOption.textContent = "All";
    select.appendChild(allOption);

    const projectKey = "tasks_" + localStorage.getItem("currentProject");
    let tasks = JSON.parse(localStorage.getItem(projectKey) || "[]");

    let names = [...new Set(tasks.map(task => task.name))];

    let namesInSelect = Array.from(select.options).map(option => option.value);

    names.forEach(name => {
        if (!namesInSelect.includes(name) || namesInSelect == null) {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        }
    });
}

let undefinedUsers = 0;

function addName() {
    const input = document.getElementById("nameInput");
    let name = input.value.trim();
    if (!name) {
        undefinedUsers++;
        name = `user ${undefinedUsers}`;
    }
    input.value = "";
    return name;
}

function addTask() {
    const input = document.getElementById("taskInput");
    const taskText = input.value.trim();
    const nameText = addName();
    if (!taskText) return;

    const projectName = localStorage.getItem("currentProject");
    const projectKey = "tasks_" + projectName;

    let raw = localStorage.getItem(projectKey);
    let tasks = raw ? JSON.parse(raw) : [];

    getUserColor(nameText);

    tasks.push({ text: taskText, status: "todo", name: nameText });
    localStorage.setItem(projectKey, JSON.stringify(tasks));

    renderTask(taskText, "todo", nameText);

    filterByName();

    input.value = "";
}

function renderTask(text, status, name) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("draggable", "true");
    task.setAttribute("data-name", name);
    const color = getUserColor(name);

    task.innerHTML = `
        <span>${text} - <span style="color: ${color}">${name}</span></span>
        <i class="fas fa-trash delete-icon" onclick="deleteTask(this)"></i>
    `;

    task.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", text);
        const currentColumn = task.closest(".column").id;
        e.dataTransfer.setData("status", currentColumn);
        e.dataTransfer.setData("name", name);
        setTimeout(() => {
            task.style.display = "none";
        }, 0);
    });

    task.addEventListener("dragend", () => {
        task.style.display = "flex";
    });

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
    const name = task.getAttribute("data-name");
    removeNameFromFilter(name);

    task.remove();

    const projectName = localStorage.getItem("currentProject");
    const projectKey = "tasks_" + projectName;

    let tasks = JSON.parse(localStorage.getItem(projectKey) || []);
    tasks = tasks.filter(task => `${task.text} - ${task.name}` !== taskText);

    localStorage.setItem(projectKey, JSON.stringify(tasks));

    updateTaskCounts();
}

function removeNameFromFilter(name) {
    const select = document.getElementById("filterOptions");
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].textContent == name) {
            select.remove(i);
            break;
        }
    }
}

function getUserColor(name) {
    let colorsMap;

    try {
        colorsMap = JSON.parse(localStorage.getItem("userColors")) || {};
    } catch {
        colorsMap = {};
    }

    if (!Object.prototype.hasOwnProperty.call(colorsMap, name)) {
        const newColor = generateRandomColor();
        colorsMap[name] = newColor;
        localStorage.setItem("userColors", JSON.stringify(colorsMap));
    }

    return colorsMap[name];
}

function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let index = 0; index < 6; index++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function goBack() {
    window.location.href = "index.html";
}