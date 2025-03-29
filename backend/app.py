from fastapi import FastAPI
from backend.routes import tweet_routes

app = FastAPI()

# prefix? tags?
app.include_router(tweet_routes.router, prefix='/tweets', tags=['tweets'])