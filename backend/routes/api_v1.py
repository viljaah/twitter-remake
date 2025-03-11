from flask import Blueprint 
from .user_routes import user_bp
#import .tweet_routes as book_bp once variable is created 

api_v1_bp = Blueprint('api_v1', __name__)

#mount the user blueprint under /users
api_v1_bp.register_blueprint(user_bp, url_prefix='/users')

# If you have other blueprints, register them similarly:
# api_v1_bp.register_blueprint(book_bp, url_prefix='/tweet')