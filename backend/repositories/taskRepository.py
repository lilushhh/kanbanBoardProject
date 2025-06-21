import json
from pathlib import Path
from models.taskModel import Task

def get_all_tasks(project_name: str):
    project_name = project_name.lower().replace(" ","_")
    task_path = Path("data") / f"tasks_{project_name}.json"
    try:
        with open(task_path, "r", encoding='utf-8') as task_json:
            data = json.load(task_json)
        return [Task(**item) for item in data]
    except FileNotFoundError:
        return []

def add_task(project_name: str, task: Task):
    tasks_list = get_all_tasks(project_name)
    tasks_list.append(task)
    task_path = Path("data") / f"tasks_{project_name}.json"
    with open(task_path, "w", encoding="utf-8") as f:
        json.dump([t.dict() for t in tasks_list], f, indent=4)

def delete_task(project_name: str, task_text: str):
    tasks_list = get_all_tasks(project_name)
    tasks_list = [task for task in tasks_list if task.text != task_text]
    task_path = Path("data") / f"tasks_{project_name}.json"
    with open(task_path, "w", encoding="utf-8") as f:
        json.dump([t.dict() for t in tasks_list], f, indent=4)

def update_task_status(project_name: str, task_text: str, new_status: str):
    tasks_list = get_all_tasks(project_name)
    task = next((t for t in tasks_list if t.text == task_text), None)
    if task:
        task.status = new_status
    task_path = Path("data") / f"tasks_{project_name}.json"
    with open(task_path, "w", encoding="utf-8") as f:
        json.dump([t.dict() for t in tasks_list], f, indent=4)
    return {"message": "Task updated"} if task else {"message": "Task not found"}
