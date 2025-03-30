from fastapi import HTTPException, status #exceptions are used as error handler, like in express we use try/catch
from sqlalchemy.orm import Session
from models.user_schema import User
import bcrypt 

# @desc create new account
# route POST /api/users/register
def create_user(user, db: Session):
    #Validates if a username already exists
    db_user = db.query(User).filter(User.username == user.username).first()
    #this is error handler
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Validates if an email already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hashes the password using bcrypt (good security practice)
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    # Creates a new user with the provided data
    new_user = User(
        username = user.username,
        email = user.email,
        password_hash = hashed_password.decode('utf-8'),
        display_name = user.display_name,
        bio = user.bio,
        # profile_picture_url = user.profile_picture_url
    )
    # Adds the user to the database and commits the transaction
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    # Returns the newly created user
    return new_user