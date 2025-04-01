from pydantic import BaseModel, Field

class TweetCreate(BaseModel):
    user_id: int = Field(...) # remove this eventually, when we get current user stuff
    content: str = Field(...)

class TweetUpdate(BaseModel):
    content: str = Field(...)