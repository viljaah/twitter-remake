from fastapi import FastAPI
from config.db import engine, Base
from routes.tweet_routes import tweet_router
from routes.user_routes import userRouter 

# this creates tables if they have not been created yet, need to create the tbales in my db before i can use them
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include the router - this is like app.use("/api/users", userRoutes) in Express
app.include_router(userRouter, prefix="/api")
app.include_router(tweet_router, prefix="/api/tweets", tags=["tweets"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)

