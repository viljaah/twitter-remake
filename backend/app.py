from fastapi import FastAPI
from config.db import engine, Base
from routes.tweet_routes import tweet_router
from routes.user_routes import userRouter 
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from dotenv import load_dotenv
from fastapi.responses import RedirectResponse
load_dotenv()

# this creates tables if they have not been created yet, need to create the tbales in my db before i can use them
Base.metadata.create_all(bind=engine)
app = FastAPI()

origins = [
    "http://localhost:3000",  # Adjust if running locally
    "https://twitter-remake-frontend-1qap.onrender.com",
]
# add CORS middleware to allow requests from specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows only specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include the router - this is like app.use("/api/users", userRoutes) in Express
app.include_router(userRouter, prefix="/api")
app.include_router(tweet_router, prefix="/api")

#After this change, visiting your base URL will redirect to the FastAPI automatic documentation page where you can see and test all your API endpoints
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")

port = int(os.environ.get("PORT", 8000))
print(f"Starting on port: {port}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"Starting on port: {port}")  # Debug line; remove this in production
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False)
