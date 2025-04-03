from pydantic import BaseModel, Field

class TweetCreate(BaseModel):
    content: str = Field(...)

class TweetUpdate(BaseModel):
    content: str = Field(...)