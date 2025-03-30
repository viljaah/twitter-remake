from pydantic import BaseModel, Field

class TweetCreate(BaseModel):
    user_id: int = Field(...)
    content: str = Field(...)

class TweetUpdate(BaseModel):
    content: str = Field(...)