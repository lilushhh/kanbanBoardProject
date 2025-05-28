document.addEventListener("DOMContentLoaded", () => {
    const projectName = localStorage.getItem("currentProject");
    if (projectName) {
        const title = document.getElementById("boardTitle");
        title.textContent = `${projectName} - Kanban Board`;
    } else {
        document.getElementById("boardTitle").textContent = "Untitled Project - Kanban Board";
    }
});

function goBack() {
    window.location.href = "index.html";
}