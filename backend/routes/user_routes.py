from fastapi import APIRouter, FastAPI
from config.db import get_db
from models.user_schema import User
import bcrypt

app = FastAPI()

# creates a routes instance 
userRouter = APIRouter(
    prefix="/users", #this acts like app.use("api/users", userRoutes) in express
    tags=["users"], #this is for API documentation grouping
)

# @desc create new account
# route POST /users/register
@userRouter.post("/register")
async def register_user():
    return {"message": "User registered successfully"}

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