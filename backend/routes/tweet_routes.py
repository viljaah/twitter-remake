# endpoints for tweet management
# create, retrieve, update, delete, like, unlike, reply 
from flask import Flask, Blueprint, jsonify, request

tweets_bp = Blueprint('tweets', __name__)
# @desc GET retrive all tweets
# route /twees

# @desc GET retrive one tweet
# route /twees/{tweet_id}

# @desc POST post a new tweet
# route /twees

# @desc PUT edit one tweet
# route /twees/{tweet_id}

# @desc DELETE delete one tweet
# route /twees/{tweet_id}
