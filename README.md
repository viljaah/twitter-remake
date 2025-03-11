This fetches the latest changes from main and merges them into your current branch:
git pull origin main

Our first step in this project was to define the structure and define endpoints.

Installations so far:
- pip install requests (success)
- pip install Flask (success)
- pip install Flask-PyMongo (success)

Technologies:
- database: mongoDB
- bakend: python
- front-end: javascript, maybe with REACT framework (and html+css ofc)


Note:
When installing Flask, the modules 'request', 'jsonify' and 'abort' come bundled with it. They are part of Flasks core functionallity:
    - request: handles incomming HTTP requests
    - jsonify: creates JSON responses easily
    - abort: provides a way to raise HTTP exceptions (eg 404 or 403)

### WRITE DOWNBELOW STEPS DONE: 
step 1: We defined separate blueprints in our project for managing different functionalities. For example, we created a user_routes blueprint (handling registration, login, profile management, etc.) and a tweet_routes blueprint (handling tweet-related operations).

step 2: We created an api_v1.py file that imports both the user_routes and tweet_routes blueprints. In api_v1.py, we registered each blueprint with specific URL prefixes (e.g., /users for user endpoints) <-- specifically for user_routes.py 

step 3: In our main application file (e.g., app.py), we imported the aggregated blueprint from api_v1.py. We registered this blueprint with a URL prefix (/api/v1), which means that all endpoints defined in our blueprints are now available under this path.

Resulting endpoints structure for users: 
    POST /api/v1/users → Create new account
    POST /api/v1/users/login → Authenticate user
    GET /api/v1/users/{user_id} → Retrieve user profile
    PUT /api/v1/users/{user_id} → Update user profile
    POST /api/v1/users/{user_id}/follow → Follow other accounts
    PUT /api/v1/users/{user_id}/unfollow → Unfollow other accounts
    GET /api/v1/users/{user_id}/followers → List all user followers
    GET /api/v1/users/{user_id}/following → List all accounts the user is following
    DELETE /api/v1/users/{user_id} → Delete user account