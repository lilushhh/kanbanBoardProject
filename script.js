function loadProjects() {
    const projects = JSON.parse(localStorage.getItem("projects") || "[]");
    const projectList = document.getElementById("projectsList");
    projectList.innerHTML = "";

    projects.forEach(project => {
        const btn = document.createElement("button");
        btn.textContent = project;
        btn.onclick = () => {
            localStorage.setItem("currentProject", project);
            window.location.href = "project.html";
        };
        projectList.appendChild(btn);
    });
}

function addProject() {
    const input = document.getElementById("projectNameInput");
    const projectName = input.value.trim();

    if (!projectName) return;

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");
    if (!projects.includes(projectName)) {
        projects.push(projectName);
        localStorage.setItem("projects", JSON.stringify(projects));
        loadProjects();
        input.value = "";
    }
}
window.onload = loadProjects();