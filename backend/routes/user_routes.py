# endpoints for user management
# register, login, edit, update, delete, follow, unfollow, retrieve all followers and following
from flask import Flask, Blueprint, jsonify, request

user_bp = Blueprint('user', __name__)

# @desc POST create new account
# route /users
@user_bp.route('/', methods=['POST'])
def register_user():
    data = request.get_json()
     # Logic to create a new account goes here.
    # For example: create a user record in the database.
    return jsonify({'message': 'Account created successfully', 'data': data}), 201

# @desc POST authenticate user (in this file or in middleware?)
# route /users/login
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    # Logic for authenticating the user goes here.
    # For example: verify credentials and generate a token.
    return jsonify({'message': 'User logged in successfully', 'data': data}), 200

# @desc GET retrieve user profile
# route /users/{user_id}

# @desc PUT update user profile
# route /users/{user_id}

# @desc POST follow other accounts
# route /users/{user_id}/follow

# @desc PUT unfollow other accounts (DELETE?)
# route /users/{user_id}/unfollow

# @desc GET list all user followers
# route /users/{user_id}/followers

# @desc GET list all accounts the user is following
# route /users/{user_id}/following

# @desc DELETE delete your own account
# route /users/{user_id}
