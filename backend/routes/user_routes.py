from fastapi import APIRouter, FastAPI, Depends
from sqlalchemy.orm import Session
from config.db import get_db
from validators.user_validate import UserCreate, UserResponse
from controllers.user_controller import create_user

app = FastAPI()

# creates a routes instance 
userRouter = APIRouter(
    prefix="/users", #this acts like app.use("api/users", userRoutes) in express
    tags=["users"], #this is for API documentation grouping
)
'''
response_model=UserResponse tells fastAPi:
1. what shcema to use for validating and converting the response
2. what fields to include in the response (filter out any extra data)
3. what to show in the automatic API documentation
'''
@userRouter.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, db: Session = Depends(get_db)): # db: session depends getdb, it tells fastapi to call my get_db() function to create db session 
    return create_user(user, db)

# @desc login user
# route POST /users/login
@userRouter.post("/login")
async def login_user():
    return {"message": "User logged in successfully"}

# @desc logout user
# route POST /users/logout
@userRouter.post("/logout")
async def logout_user():
    return {"message": "User logged out successfully"}

# @desc retrieve all accouts
# route GET /users
@userRouter.get("/")
async def get_users():
    return {"message": "All users retrieved successfully"}

# @desc retrieve specific accout
# route GET /users/{user_id}
@userRouter.get("/{user_id}")
async def get_user(user_id: int):
    return {"message": f"User {user_id} retrieved successfully"}

# @desc delete your own account
# route DELETE /users/{user_id}
@userRouter.delete("/{user_id}")
async def delete_user(user_id: int):
    return {"message": f"User {user_id} deleted successfully"}

# @desc search for account
# route GET /users/search?q={query}
@userRouter.get("/search")
async def search_users(q: str):
    return {"message": f"Searching for users matching: {q}"}