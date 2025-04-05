from fastapi import APIRouter, FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from config.db import get_db
from validators.user_validate import UserCreate, UserResponse, UserLogin
from controllers.user_controller import create_user, login_user, logout_user, delete_user_by_id, search_user_by_username, get_tweets_by_user
from controllers.following_controller import follow_user, unfollow_user, get_user_following
from middleware.auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

# creates a routes instance 
userRouter = APIRouter(
    prefix="/users", #this acts like app.use("api/users", userRoutes) in express
    tags=["users"], #this is for API documentation grouping
)
# this is the public route, so no auth is needed
# THIS IS IMPLEMENTED (MÅ PUSSES OPP PÅ FROTNEND)
@userRouter.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, db: Session = Depends(get_db)): # db: session depends getdb, it tells fastapi to call my get_db() function to create db session 
    return create_user(user, db)

# login is using the OAuth2PasswordRequestForm
# THIS IS IMPLEMENTED (MÅ PUSSES OPP PÅ FROTNEND)
@userRouter.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # creating here a UserLogin-like object
    user_credentials = UserLogin(
        username = form_data.username,
        password = form_data.password
    )
    return login_user(user_credentials, db) # the message being dipalyed

# THIS IS IMPLEMENTED (MÅ PUSSES OPP PÅ FROTNEND)
@userRouter.post("/logout")
async def handle_logout():
    return logout_user()

#/me endpoint: Returns the currently authenticated user based on their JWT token
# No need to specify a user ID in the URL
# Always returns the profile of whoever is logged in
#Useful for "My Profile" features
# need to implement htis
@userRouter.get("/me")
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get the currently authenticated user's profile"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "display_name": current_user.display_name,
        "bio": current_user.bio
    }

# In FastAPI, route order matters. When you have a route with a path parameter like /{user_id} and another specific route like /search, the more specific route (/search) needs to be defined first.
# THIS IS IMPLEMENTED (MÅ PUSSES OPP PÅ FROTNEND)
@userRouter.get("/search")
async def search_users(q: str, db: Session = Depends(get_db)):
    return search_user_by_username(q, db)

# THIS IS IMPLEMENTED 
@userRouter.get("/{user_id}/tweets")
async def get_user_tweets(user_id: int, db: Session = Depends(get_db)):
    return get_tweets_by_user(user_id, db)


# Protected delete route - can only delete your own account
# implement this
# THIS IS IMPLEMENTED (MÅ PUSSES OPP PÅ FROTNEND)
@userRouter.delete("/{user_id}")
async def delete_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return delete_user_by_id(user_id, db, current_user)

# Get users the current user is following
@userRouter.get("/following")
async def get_my_following(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get list of users the current user is following"""
    return get_user_following(current_user.id, db)

# Follow a user
@userRouter.post("/follow/{user_id}")
async def handle_follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Follow a user"""
    return follow_user(current_user.id, user_id, db)

# Unfollow a user
@userRouter.delete("/follow/{user_id}")
async def handle_unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Unfollow a user"""
    return unfollow_user(current_user.id, user_id, db)


'''
response_model=UserResponse tells fastAPi:
1. what shcema to use for validating and converting the response
2. what fields to include in the response (filter out any extra data)
3. what to show in the automatic API documentation
'''