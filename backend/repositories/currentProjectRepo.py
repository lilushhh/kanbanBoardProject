from pathlib import Path
import json

current_project_path = Path("data/current_project.json")

def get_current_project():
    if current_project_path.exists():
        with open(current_project_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("name")
    return None

def set_current_project(name: str):
    with open(current_project_path, "w", encoding="utf-8") as file:
        json.dump({"name": name}, file, indent=4)
