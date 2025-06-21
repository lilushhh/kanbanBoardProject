import json
from pathlib import Path
from models.projectModel import Project

project_json_path= Path("data/projects.json")

def get_all_projects():
    with open(project_json_path, 'r', encoding='utf-8') as project_json:
        data = json.load(project_json)
    return [Project(**item) for item in data]

def add_project(project):
    projects_list = get_all_projects()
    if not any(p.name == project.name for p in projects_list):
        projects_list.append(project)
        with open(project_json_path, 'w') as file:
            json.dump([p.dict() for p in projects_list], file, indent=4)
            task_filename = f'tasks_{project.name.lower().replace(" ", "_")}.json'
            task_folder = Path("data")
            task_path = task_folder/task_filename
            with open(task_path, 'w', encoding='utf-8') as task_file:
                json.dump([], task_file, indent=4)
