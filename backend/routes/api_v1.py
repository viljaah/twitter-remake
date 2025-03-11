from flask import Blueprint 
from .user_routes import user_bp
from .tweet_routes import tweets_bp

api_v1_bp = Blueprint('api_v1', __name__)

#mount the user blueprint under /users
api_v1_bp.register_blueprint(user_bp, url_prefix='/users')
api_v1_bp.register_blueprint(tweets_bp, url_prefix='/tweets')


