from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship 
from config.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=True, index=True)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(100))
    bio = Column(Text)
    profile_picture_url = Column(String(255))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # relationship to tweets
    tweets = relationship("Tweet", back_populates="user", cascade="all, delete-orphan")
