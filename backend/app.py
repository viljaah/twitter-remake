from fastapi import FastAPI
from config.db import get_db
#from routes import tweet_routes

app = FastAPI()

# prefix? tags?
#app.include_router(tweet_routes.router, prefix='/tweets', tags=['tweets'])

@app.get("/")
def read_root():
    return {"message": "Twitter Clone API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="localhost", port=8000, reload=True)

