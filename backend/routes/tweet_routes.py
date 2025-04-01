from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from config.db import get_db
from validators.tweet_validate import TweetCreate, TweetUpdate
from controllers.tweet_controller import create_tweet, get_all_tweets, get_tweet, update_tweet, delete_tweet, search_tweets, search_hashtags
from models.user_schema import User
# from middleware.auth import get_current_user

tweet_router = APIRouter()

@tweet_router.post("/")
def post_tweet(tweet: TweetCreate, db: Session = Depends(get_db)): # add this eventually current_user: User = Depends(get_current_user)
    # convert the validated tweet to a dict (had to use model_dump() instead of dict() because of pydantic version)
    tweet_data = tweet.model_dump()
    # automatically add the current user id
    # tweet_data["user_id"] = current_user.id
    new_tweet = create_tweet(db, tweet_data)
    return new_tweet

@tweet_router.get("/")
def read_all_tweets(db: Session = Depends(get_db)):
    tweets = get_all_tweets(db)
    return tweets

@tweet_router.get("/search")
def search_for_tweets(query: str, db: Session = Depends(get_db)):
    results = search_tweets(db, query)
    return results

@tweet_router.get("/hashtag/search")
def search_for_hashtags(query: str, db: Session = Depends(get_db)):
    results = search_hashtags(db, query)
    return results

@tweet_router.get("/{tweet_id}")
def read_tweet(tweet_id: int, db: Session = Depends(get_db)):
    tweet = get_tweet(db, tweet_id)
    if not tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")
    return tweet

@tweet_router.patch("/{tweet_id}")
def put_tweet(tweet_id: int, tweet: TweetUpdate, db: Session = Depends(get_db)):
    updated_tweet = update_tweet(db, tweet_id, tweet.model_dump())
    if not updated_tweet:
        raise HTTPException(status_code=404, detail="Tweet not found")
    return updated_tweet

@tweet_router.delete("/{tweet_id}")
def remove_tweet(tweet_id: int, db: Session = Depends(get_db)):
    success = delete_tweet(db, tweet_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tweet not found")
    return {"messsage": "Tweet deleted successfully"}
