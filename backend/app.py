from fastapi import FastAPI
from config.db import engine, Base
from routes.tweet_routes import tweet_router
from routes.user_routes import userRouter 
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from dotenv import load_dotenv

load_dotenv()

# this creates tables if they have not been created yet, need to create the tbales in my db before i can use them
Base.metadata.create_all(bind=engine)

app = FastAPI()

#For your frontend to be able to make requests to your backend, you need to enable CORS (Cross-Origin Resource Sharing)
# These settings help your React app communicate with your backend without restrictions. In a production environment, 
# you might want to be more specific about which methods and headers are allowed for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"], # or have [*]
    allow_headers=["*"],
)

# Include the router - this is like app.use("/api/users", userRoutes) in Express
app.include_router(userRouter, prefix="/api")
app.include_router(tweet_router, prefix="/api")

if __name__ == "__main__":
    # Use environment variables set by Render or fallback to defaults for local development
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host=host, port=port, reload=True)
