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


# @desc login user
# route POST /users/login
def login_user(user_credentials, db: Session):
    # find user by username
    db_user = db.query(User).filter(User.username == user_credentials.username).first()

    if not db_user:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Invalid username or password",
            headers = {"WWW-Authenticate": "Bearer"},
        )
    # Checks if the password matches using bcrypt
    # we need to encode the password from teh request to bytes and comapre with stored hash
    _is_password_correct = bcrypt.checkpw(
        user_credentials.password.encode('utf-8'), #UTF-8 is a character encoding that can represent virtually all characters in the Unicode standard
        db_user.password_hash.encode('utf-8')
    )

    if not _is_password_correct:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail= "invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    #if authentication is successful, return user data (without password)
    return {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "display_name": db_user.display_name,
        "bio": db_user.bio,
        "message": "login successful"
    }

# @desc logout user
# route POST /users/logout
def logout_user():
 return {
        "success": True,
        "message": "User logged out successfully"
    }

# @desc retrieve all accouts
# route GET /users
def getAll_users(db: Session):
    #query all users from the db
    users = db.query(User).all()

    #create a list with user data
    user_list = []
    for user in users:
        user_list.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "display_name": user.display_name,
            "bio": user.bio
        })
    return {
        "count": len(user_list),
        "users": user_list
    }


# @desc retrieve specific accout
# route GET /users/{user_id}
"""
    Retrieves a specific user by their ID.
    
    :param user_id: The ID of the user to retrieve
    :param db: SQLAlchemy database session
    :return: User details if found
    :raises HTTPException: If user not found
    """
def get_user_by_id(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code = status.HTTP_404_NOT_FOUND,
            detail = f"User with ID {user_id} not found"
        )
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "display_name": user.display_name,
            "bio": user.bio,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    }

# @desc delete your own account
# route DELETE /users/{user_id}
"""
    Deletes a user account by ID.
    
    :param user_id: The ID of the user to delete
    :param db: SQLAlchemy database session
    :return: Success message if deleted
    :raises HTTPException: If user not found
    """
def delete_user_by_id(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    db.delete(user)
    db.commit()
    
    return {
        "message": f"User with ID {user_id} has been deleted"
    }

# @desc search for account
# route GET /users/search?q={query}