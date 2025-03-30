from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr  # Requires email-validator package
    password: str
    display_name: str = None
    bio: str = None
    # profile_picture_url: str = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    display_name: str = None
    bio: str = None
    # profile_picture_url: str = None

    class Config:  # Properly indented to be nested inside UserResponse
        orm_mode = True  # This allows conversion from SQLAlchemy model