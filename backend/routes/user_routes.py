from fastapi import APIRouter, FastAPI, Depends
from sqlalchemy.orm import Session
from config.db import get_db
from validators.user_validate import UserCreate, UserResponse, UserLogin
from controllers.user_controller import create_user, login_user, logout_user, getAll_users, get_user_by_id, delete_user_by_id, search_user_by_username

app = FastAPI()

# creates a routes instance 
userRouter = APIRouter(
    prefix="/users", #this acts like app.use("api/users", userRoutes) in express
    tags=["users"], #this is for API documentation grouping
)

@userRouter.post("/register", response_model=UserResponse, status_code=201)
async def register_user(user: UserCreate, db: Session = Depends(get_db)): # db: session depends getdb, it tells fastapi to call my get_db() function to create db session 
    return create_user(user, db)


@userRouter.post("/login")
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    return login_user(user_credentials, db) # the message being dipalyed

@userRouter.post("/logout")
async def handle_logout():
    return logout_user()

@userRouter.get("/")
async def get_users(db: Session = Depends(get_db)):
    return getAll_users(db)
# In FastAPI, route order matters. When you have a route with a path parameter like /{user_id} and another specific route like /search, the more specific route (/search) needs to be defined first.
@userRouter.get("/search")
async def search_users(q: str, db: Session = Depends(get_db)):
    return search_user_by_username(q, db)

@userRouter.get("/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_by_id(user_id, db)

@userRouter.delete("/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    return delete_user_by_id(user_id, db)






'''
response_model=UserResponse tells fastAPi:
1. what shcema to use for validating and converting the response
2. what fields to include in the response (filter out any extra data)
3. what to show in the automatic API documentation
'''