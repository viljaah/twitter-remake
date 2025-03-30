from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from config.db import get_db
from validators.tweet_validate import TweetCreate, TweetUpdate
from controllers.tweet_controller import create_tweet, get_all_tweets, get_tweet, update_tweet, delete_tweet, search_tweets, search_hashtags

tweet_router = APIRouter()

@tweet_router.post("/")
def post_tweet(tweet: TweetCreate, db: Session = Depends(get_db)):
    new_tweet = create_tweet(db, tweet.model_dump())
    return new_tweet

@tweet_router.get("/")
def read_all_tweets(db: Session = Depends(get_db)):
    tweets = get_all_tweets(db)
    return tweets

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

@tweet_router.get("/search")
def search_for_tweets(query: str, db: Session = Depends(get_db)):
    results = search_tweets(db, query)
    return results

@tweet_router.get("/hashtag/search")
def search_for_hashtags(query: str, db: Session = Depends(get_db)):
    results = search_hashtags(db, query)
    return results