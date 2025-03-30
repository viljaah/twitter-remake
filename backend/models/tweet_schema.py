from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from config.db import Base

class Tweet(Base):
    __tablename__ = "tweets"

    id = Column(Integer, primary_key=True, index=True)
    # ondelete="CASCADE" makes sure that if a user is deleted, their tweets are also removed
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # nullable=False: the column cannot store a NULL valu, same as the the SQL NOT NULL
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # establishes a relationship to the User model
    user = relationship("User", back_populates="tweets")
    hashtags = relationship("Hashtag", secondary="tweet_hashtags", back_populates="tweets")
