from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv
from config.db import get_db
from models.user_schema import User

# load environment variables
load_dotenv()

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# This tells FastAPI where your login endpoint is
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='users/login')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    '''
    Create a new JWT token
    
    Arguments:
        data: the data to encode in the token (user id)
        expires_delta: Optional expiration time
    
    Returns:
        the encoded JWT token
    '''
    to_encode = data.copy()
    
    # Set expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    
    # Create the JWT token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Verify the token and get the current user
    
    Args:
        token: The JWT token from the request
        db: Database session
    
    Returns:
        The current user if token is valid
    
    Raises:
        HTTPException: If token is invalid
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Get the user from the database
    user = db.query(User).filter(User.id == user_id).first()
    
    if user is None:
        raise credentials_exception
        
    return user


'''
What is JWT?
JWT stands for JSON Web Token. It's a compact, URL-safe means of representing claims between two parties. In the context of authentication:

When a user logs in successfully, the server creates a JWT containing user information (like user ID, roles)
The server signs this token with a secret key and sends it to the client
The client stores this token (typically in localStorage or cookies)
For subsequent requests, the client sends this token in the Authorization header
The server verifies the token's signature to authenticate the user

How JWT Authentication Works in FastAPI

Login Process:

User sends username and password -> in our implemnentation this happens when a client makes a POST request to our /users/login enpoind
Server verifies credentials -> the controller is meant by server
If valid, server creates a JWT with user info and signs it
The token is returned to the client


Protected Route Access:

When the user tries to access a protected route, they include the JWT in their request header
The get_current_user dependency extracts and verifies the token
If valid, it retrieves the user from the database
The route handler receives the authenticated user


Middleware Flow:

FastAPI's dependency injection system acts as middleware
The Depends(get_current_user) parameter dependency runs before the route handler
If authentication fails, it returns a 401 error before your route code runs

When you implement JWT later:

You have a few options for logout:
a) Client-side only: The client simply deletes the stored token (our implementaiton currenclty supports this client-side logout (option A))
b) Token blacklisting: The server maintains a list of invalidated tokens
c) Short token expiration with refresh tokens: Main tokens expire quickly, refresh tokens can be invalidated

'''

'''
Look for articles that specifically cover:

Basic JWT concepts (tokens, claims, signing)
Implementing login with JWT in FastAPI
Using FastAPI dependencies for protected routes
Token refresh strategies

good articles: 
https://medium.com/@kevinkoech265/jwt-authentication-in-fastapi-building-secure-apis-ce63f4164eb2

the soruce code for the code below is also listed in the readme.md

'''