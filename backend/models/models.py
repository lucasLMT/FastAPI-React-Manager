from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from uuid import UUID, uuid4

class UserModel(BaseModel):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    email: str
    password: str

    class Config:
        orm_mode = True

class ProjectModel(BaseModel):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    title: str
    status: Optional[str] = None
    start: Optional[date] = None
    end: Optional[date] = None
    user_id: Optional[str] = None

    class Config:
        orm_mode = True

class TaskModel(BaseModel):
    id: UUID = Field(default_factory=uuid4, alias="_id")
    title: str
    description: str
    status: str
    finish_date: Optional[date] = None
    project_id: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str | None = None