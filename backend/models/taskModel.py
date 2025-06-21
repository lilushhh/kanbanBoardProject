from typing import Optional
from pydantic import BaseModel

class Task(BaseModel):
    text: str
    name: Optional[str] = None
    status: str