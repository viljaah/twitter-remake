from sqlalchemy.orm import Session
from models.tweet_schema import Tweet
from models.hashtag_schema import Hashtag

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

# retrive one tweet
# route GET /tweets/{tweet_id}
def get_tweet(db: Session, tweet_id: int) -> Tweet:
    """
    :param tweet_id: the id of the tweet to retrieve
    :return: the tweet object if found, if not, None.
    """
    # filter by the id column to match the provided tweet_id, first() returns the first matching record, or None
    tweet = db.query(Tweet).filter(Tweet.id == tweet_id).first()
    return tweet

# edit one tweet
# route PUT /tweets/{tweet_id}
def update_tweet(db: Session, tweet_id: int, tweet_data: dict) -> Tweet:
    """
    :param tweet_id: the id of the tweet to update
    :param tweet_data: dictionary with fields to update (e.g {'content': 'New content'}...)
    """
    tweet = db.query(Tweet).filter(Tweet.id == tweet_id).first()
    # check if there is a tweet, to avoid trying to update a non-existent tweet
    if tweet is None:
        return None
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
        return False
    db.delete(tweet)
    db.commit()
    return True

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

# search for hashtags that have the query string in their name
# route GET /tweets/hashtag/search?={query}
def search_hashtags(db: Session, query: str):
    """
    :param query: the search string
    :return: a list of hashtags that match the search query, if no hashtags match it returns an empty list
    """
    hashtags = db.query(Hashtag).filter(Hashtag.name.ilike(f"%{query}%")).all()
    return hashtags
