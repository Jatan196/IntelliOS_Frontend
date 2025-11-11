from pydantic import BaseModel, EmailStr
from typing import Optional


class SignUpIn(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    password: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: Optional[str] = None
    model_config = {"from_attributes": True}
