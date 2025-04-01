from sqlalchemy import Column, Integer, String, DateTime, func, Table, ForeignKey
from sqlalchemy.orm import relationship
from config.db import Base

# association table for the many-to-many relationship between tweets and hashtags
tweet_hashtags = Table(
    "tweet_hashtags",
    Base.metadata,
    Column("tweet_id", Integer, ForeignKey("tweets.id", ondelete="CASCADE"), primary_key=True),
    Column("hashtag_id", Integer, ForeignKey("hashtags.id", ondelete="CASCADE"), primary_key=True)
)

class Hashtag(Base):
    __tablename__ = "hashtags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime, default=func.now())

    # relationship to Tweet using the association table
    tweets = relationship("Tweet", secondary="tweet_hashtags", back_populates="hashtags")
