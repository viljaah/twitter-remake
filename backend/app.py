from fastapi import FastAPI
from config.db import get_db, engine, Base
from models.user_schema import User
from models.tweet_schema import Tweet
from models.hashtag_schema import Hashtag
from routes.user_routes import userRouter 
#from routes import tweet_routes

app = FastAPI()

# Include the router - this is like app.use("/api/users", userRoutes) in Express
app.include_router(userRouter, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)

