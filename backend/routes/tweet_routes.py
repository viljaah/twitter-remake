from fastapi import APIRouter, HTTPException, status
from backend.models.tweet_schema import Tweet, TweetCreate
from backend.controllers.tweet_controller import create_tweet, list_tweets, get_tweet, update_tweet, delete_tweet

router = APIRouter()

@router.post('/', response_model=Tweet, status_code=status.HTTP_201_CREATED)
def post_tweet(tweet: TweetCreate, user_id: str):
    new_tweet = create_tweet(tweet, user_id)
    return new_tweet