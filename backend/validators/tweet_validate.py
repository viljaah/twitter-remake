from pydantic import BaseModel, Field

# must include the "content" field as a string
class TweetCreate(BaseModel):
    # field(...) indicates that this field is required
    content: str = Field(...)

# must include the "content" field as a string
class TweetUpdate(BaseModel):
    content: str = Field(...)