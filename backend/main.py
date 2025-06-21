from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.projectModel import Project
from models.taskModel import Task
from repositories.projectRepository import get_all_projects, add_project
from repositories.taskRepository import get_all_tasks, add_task, delete_task, update_task_status
from repositories.currentProjectRepo import get_current_project, set_current_project

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/projects")
def read_projects():
    return get_all_projects()

@app.post("/projects")
def create_project(project: Project):
    add_project(project)
    return {"message": f"Project {project.name} added successfully."}

@app.get("/projects/current")
def get_current():
    return {"name": get_current_project()}

@app.post("/projects/current")
def set_current(name: str):
    set_current_project(name)
    return {"message": f"Current project set to {name}"}

@app.get("/projects/{project_name}/tasks")
def read_tasks(project_name: str):
    return get_all_tasks(project_name)

@app.post("/projects/{project_name}/tasks")
def add_task_route(project_name: str, task: Task):
    add_task(project_name, task)
    return {"message": f"Task added to {project_name}"}

@app.delete("/projects/{project_name}/tasks/{task_text}")
def delete_task_route(project_name: str, task_text: str):
    delete_task(project_name, task_text)
    return {"message": "Task deleted"}

@app.put("/projects/{project_name}/tasks")
def update_status(project_name: str, task: Task):
    return update_task_status(project_name, task.text, task.status)

@app.get("/current-project")
def read_current_project():
    return {"name": get_current_project()}

@app.post("/current-project")
def write_current_project(name: str):
    set_current_project(name)
    return {"message": "Current project updated"}
