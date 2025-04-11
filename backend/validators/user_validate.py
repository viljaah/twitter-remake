from pydantic import BaseModel, EmailStr, field_validator, ConfigDict

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    display_name: str = None
    bio: str = None

    @field_validator('email')
    @classmethod
    def email_must_be_valid(cls, v):
        """
        Custom email validator that provides clear error messages.
        
        Parameters Explanation:
        1. cls: Reference to the class itself (similar to 'self' for instance methods).
           Pydantic validators are class methods and always receive the class as their first parameter.
        2. v: The value of the email field being validated.
        
        Validation Logic:
        The validation checks two things:
        1. '@' not in v: Checks if the @ symbol is missing from the email.
        2. '.' not in v.split('@')[1]: Checks if there's a dot in the domain part of the email:
           - v.split('@') divides the email string at the @ symbol. E.g., "user@example.com" → ["user", "example.com"]
           - [1] accesses the second part (the domain: "example.com")
           - '.' not in ... checks if there's no dot in this domain part
        
        For an input like "mm@mm", validation fails because:
        - v.split('@') gives ["mm", "mm"]
        - v.split('@')[1] is "mm"
        - '.' not in "mm" is True (there's no dot)
        - So the condition is True, and ValueError is raised
        
        Why This Works:
        The function checks for the minimum structure of a valid email:
        1. Must contain an @ symbol
        2. Must have a dot in the domain part after the @ symbol
        
        This is a simple validation on top of Pydantic's built-in EmailStr type,
        which already does comprehensive validation. This custom validator
        provides a more user-friendly error message.
        """
        if '@' not in v or '.' not in v.split('@')[1]:
            raise ValueError('Please enter a valid email address (e.g., example@domain.com)')
        return v


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    display_name: str = None
    bio: str = None

    model_config = ConfigDict(from_attributes=True)  # Replaces the old orm_mode=True
    #class Config:  # Properly indented to be nested inside UserResponse
        #orm_mode = True  # This allows conversion from SQLAlchemy model