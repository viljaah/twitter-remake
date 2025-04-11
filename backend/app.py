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


#For your frontend to be able to make requests to your backend, you need to enable CORS (Cross-Origin Resource Sharing)
# These settings help your React app communicate with your backend without restrictions. In a production environment, 
# you might want to be more specific about which methods and headers are allowed for security
app.add_middleware(
    CORSMiddleware,
     allow_origins=[
        "http://localhost:3000",
        "https://twitter-remake-frontend.onrender.com",  # Add your deployed frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"], # or have [*]
    allow_headers=["*"],
)

# Include the router - this is like app.use("/api/users", userRoutes) in Express
app.include_router(userRouter, prefix="/api")
app.include_router(tweet_router, prefix="/api")

#After this change, visiting your base URL will redirect to the FastAPI automatic documentation page where you can see and test all your API endpoints
@app.get("/")
async def root():
    return RedirectResponse(url="/docs")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)
