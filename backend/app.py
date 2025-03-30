from fastapi import FastAPI
from config.db import get_db, engine, Base
from models.user_schema import User
from models.tweet_schema import Tweet
from models.hashtag_schema import Hashtag
from routes.tweet_routes import tweet_router

app = FastAPI()

app.include_router(tweet_router, prefix="/api/tweets", tags=["tweets"])

@app.get("/")
def read_root():
    return {"message": "Twitter Clone API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)

