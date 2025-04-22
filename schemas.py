from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    nom: str
    prenom: str
    departement: str
    telephone: str
    role: UserRole = UserRole.ETUDIANT

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)
    confirm_password: str

    def validate_password(self):
        if self.password != self.confirm_password:
            raise ValueError("Les mots de passe ne correspondent pas")
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: UserRole

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None

# Course schemas
class CourseBase(BaseModel):
    title: str
    description: str

class CourseCreate(CourseBase):
    pass

class CourseMaterialBase(BaseModel):
    file_name: str
    file_type: str

class CourseMaterialCreate(CourseMaterialBase):
    pass

class CourseMaterial(CourseMaterialBase):
    id: int
    course_id: int
    file_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class Course(CourseBase):
    id: int
    instructor_id: int
    created_at: datetime
    updated_at: datetime
    materials: List[CourseMaterial] = []

    class Config:
        from_attributes = True 