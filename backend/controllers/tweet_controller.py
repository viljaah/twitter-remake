from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.tweet_schema import Tweet
from models.hashtag_schema import Hashtag
import re

# create a new tweet
# route POST /tweets
# tweet_data: dict, says that tweet_data should be a dictionary
def create_tweet(db: Session, tweet_data: dict) -> Tweet:
    """
    :param db: SQLAlchemy database session
    :param tweet_data: dictionary with tweet details ('user_id', 'content'...).
    :return: the newly created tweet
    """
    # dictionary unpacking (**) lets me pass key-value pairs in a dictionary as separate keyword arguments to a function or constructor
    new_tweet = Tweet(**tweet_data)

    # extract hashtags from content
    hashtags_content = set(re.findall(r"#(\w+)", tweet_data.get("content", "")))
    for tag in hashtags_content:
        hashtag_obj = db.query(Hashtag).filter(Hashtag.name == tag).first()
        if not hashtag_obj:
            hashtag_obj = Hashtag(name=tag)
            db.add(hashtag_obj)
            db.flush()  # make sure the hashtag has an id before association
        # associate the hashtag with the tweet using the updated relationship name
        new_tweet.hashtags.append(hashtag_obj)

    # the tweet is added to the session
    db.add(new_tweet)
    db.commit()
    db.refresh(new_tweet)
    return new_tweet

# retrive all tweets
# route GET /tweets
def get_all_tweets(db: Session):
    """
    :return: list of tweet objects
    """
    # fetch all records from the tweets table
    tweets = db.query(Tweet).all()
    return tweets

# search for tweets that have the query string in their content
# route GET /tweets/search?={query}
def search_tweets(db: Session, query: str):
    """
    :param query: the search string
    :return: a list of tweets that match the search query, if no tweets match it returns an empty list
    """
    # .ilike() performs a case-insensitive match, it will find tweets regardless of letter case
    # %{query}% allows matching the query string anywhere within the tweet content
    tweets = db.query(Tweet).filter(Tweet.content.ilike(f"%{query}%")).all()
    return tweets

# search for tweets with hashtags that have the query string in their name
# route GET /tweets/hashtag/search?={query}
def search_hashtags(db: Session, query: str):
    """
    :param query: the search string
    :return: a list of tweets that have a hashtag matching the query
    uses a join between tweet and hashtag
    """
    tweets = (
        db.query(Tweet)
        # join the tweets table with the associated hashtags
        .join(Tweet.hashtags)
        .filter(Hashtag.name.ilike(f"%{query}%"))
        .all()
    )
    return tweets

# edit one tweet
# route PATCH /tweets/{tweet_id}
def update_tweet(db: Session, tweet_id: int, tweet_data: dict) -> Tweet:
    """
    :param tweet_id: the id of the tweet to update
    :param tweet_data: dictionary with fields to update (e.g {'content': 'New content'}...)
    """
    tweet = db.query(Tweet).filter(Tweet.id == tweet_id).first()
    # check if there is a tweet, to avoid trying to update a non-existent tweet
    if tweet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tweet not found"
        )
    # iterates over each key-value pair and updates the corresponding attribute of the tweet
    for key, value in tweet_data.items():
        setattr(tweet, key, value)
    # the changes are saved to the database
    db.commit()
    # updates the tweet instance with the latest data from the database
    db.refresh(tweet)
    return tweet

# delete one tweet
# route DELETE /tweets/{tweet_id}
def delete_tweet(db: Session, tweet_id: int) -> bool:
    """
    :param tweet_id: the id of the tweet to delete
    :return: true if the tweet was found and deleted, if not, False.
    """
    tweet = db.query(Tweet).filter(Tweet.id == tweet_id).first()
    if tweet is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tweet not found"
        )
    db.delete(tweet)
    db.commit()
    return {"message": "Tweet deleted successfully"}
