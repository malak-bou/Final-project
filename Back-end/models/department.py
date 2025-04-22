from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from .user import Base

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Relationship with User
    users = relationship("User", back_populates="department") 