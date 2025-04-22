from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
import enum
from database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    PROFESSEUR = "professeur"
    ETUDIANT = "etudiant"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    nom = Column(String)
    prenom = Column(String)
    departement = Column(String)
    telephone = Column(String)
    role = Column(Enum(UserRole), default=UserRole.ETUDIANT)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    
    # Relationship with Course
    courses = relationship("Course", back_populates="instructor") 