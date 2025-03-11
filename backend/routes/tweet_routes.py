# endpoints for tweet management
# create, retrieve, update, delete, like, unlike, reply 
from flask import Blueprint, request, jsonify

tweets_bp = Blueprint('tweets', __name__)

# @desc GET retrive all tweets
# route /tweets
@tweets_bp.route('/', methods=['GET'])
def get_all_tweets():
    return jsonify({ "tweets": [] }), 200

# @desc GET retrive one tweet
# route /tweets/{tweet_id}
@tweets_bp.route('/<tweet_id>', methods=['GET'])
def get_single_tweet(tweet_id):
    return jsonify({ "tweet": {"id": tweet_id, "content": "Dont know"} }), 200

# @desc POST post a new tweet
# route /tweets

# @desc PUT edit one tweet
# route /tweets/{tweet_id}

# @desc DELETE delete one tweet
# route /tweets/{tweet_id}
