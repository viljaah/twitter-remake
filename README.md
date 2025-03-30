This fetches the latest changes from main and merges them into your current branch:
git pull origin main

Our first step in this project was to define the structure and define endpoints.

Installations so far:
-pip install fastapi uvicorn sqlalchemy psycopg2-binary "python-jose[cryptography]" passlib python-multipart bcrypt "pydantic[email]"

### ENDPOINTS: 
## Authentication Endpoints
- **POST /api/users/register** - Create a new user account
  - Request body: `{ "username": "string", "email": "string", "password": "string", "display_name": "string" }`
  - Response: `{ "id": int, "username": "string", "email": "string", "display_name": "string", "created_at": "timestamp" }`

- **POST /api/users/login** - Authenticate user and receive access token
  - Request body: `{ "username": "string", "password": "string" }`
  - Response: `{ "access_token": "string", "token_type": "bearer", "user": { "id": int, "username": "string" } }`

- **POST /api/users/logout** - Invalidate current access token
  - Response: `{ "message": "Successfully logged out" }`

## User Endpoints
- **GET /api/users** - List all users (with pagination)
  - Query parameters: `page=int&limit=int`
  - Response: `{ "total": int, "page": int, "limit": int, "users": [...] }`

- **GET /api/users/{user_id}** - Get a specific user's profile
  - Response: `{ "id": int, "username": "string", "display_name": "string", "bio": "string", "profile_picture_url": "string", "created_at": "timestamp", "tweet_count": int, "following_count": int, "followers_count": int }`

- **GET /api/users/search** - Search for users by username or display name
  - Query parameters: `q=string&page=int&limit=int`
  - Response: `{ "total": int, "page": int, "limit": int, "users": [...] }`

- **PUT /api/users/{user_id}** - Update user profile (authenticated)
  - Request body: `{ "display_name": "string", "bio": "string", "profile_picture_url": "string" }`
  - Response: Updated user profile

- **DELETE /api/users/{user_id}** - Delete user account (authenticated)
  - Response: `{ "message": "User successfully deleted" }`

## Tweet Endpoints
- **POST /api/tweets** - Create a new tweet (authenticated)
  - Request body: `{ "content": "string" }`
  - Response: `{ "id": int, "user_id": int, "content": "string", "created_at": "timestamp", "hashtags": [...] }`

- **GET /api/tweets** - List all tweets (with pagination)
  - Query parameters: `page=int&limit=int&user_id=int`
  - Response: `{ "total": int, "page": int, "limit": int, "tweets": [...] }`

- **GET /api/tweets/{tweet_id}** - Get a specific tweet
  - Response: `{ "id": int, "user_id": int, "user": {...}, "content": "string", "created_at": "timestamp", "updated_at": "timestamp", "hashtags": [...] }`

- **PUT /api/tweets/{tweet_id}** - Edit a tweet (authenticated, owner only)
  - Request body: `{ "content": "string" }`
  - Response: Updated tweet

- **DELETE /api/tweets/{tweet_id}** - Delete a tweet (authenticated, owner only)
  - Response: `{ "message": "Tweet successfully deleted" }`

- **GET /api/tweets/search** - Search for tweets by content
  - Query parameters: `q=string&page=int&limit=int`
  - Response: `{ "total": int, "page": int, "limit": int, "tweets": [...] }`

## Hashtag Endpoints
- **GET /api/hashtags/search** - Search for hashtags
  - Query parameters: `q=string&page=int&limit=int`
  - Response: `{ "total": int, "page": int, "limit": int, "hashtags": [...] }`


## Follow Endpoints (Optional)
- **POST /api/users/{user_id}/follow** - Follow a user (authenticated)
  - Response: `{ "message": "Successfully followed user" }`

- **DELETE /api/users/{user_id}/follow** - Unfollow a user (authenticated)
  - Response: `{ "message": "Successfully unfollowed user" }`

- **GET /api/users/{user_id}/followers** - Get a user's followers
  - Query parameters: `page=int&limit=int`
  - Response: `{ "total": int, "page": int, "limit": int, "followers": [...] }`

- **GET /api/users/{user_id}/following** - Get users that a user is following
  - Query parameters: `page=int&limit=int`
  - Response: `{ "total": int, "page": int, "limit": int, "following": [...] }`
---


### ASSIGNMENT REQUIRENMENTS 
# This is the three-tier arhitecture project to build a Twitter clone:
1. Frontend (UI level) technology:
* HTML/CSS/JS or React
* need to be hosted as a seperate serice on render (mentioned in assigment)

2. Backend (processing level):
* must be build with Python (we will use FastAPI)
* will serve as a REST API
* this is the main focus of the assigment 

3. Database (data level):
* relational database (PostgreSQl + pgAdmin)
* can be hosted anywhere we prefer (railway for exmaple)
* PostgreSQL: 
   * Structured data with predefined schemas
   * Uses SQL for querying
   * Strong relationships between tables via foreign keys
   * ACID complinat (better data integrity)

Why we need seperate hosting for webserver (frontend)?
- the assigment wants us to create a clear seperation between services, which is good arhitectural practice because it allows for:
1. independent scaling of services
2. easier maintenanse and updates
3. better security boundaries 

## Step-by-Step approach
1. Start with datbase design: 
* cretae an ER diagram of our entities
* define relaitonships between entities
* create SQL scripts for tbale creation 

2. Setup BAckend with FastAPI:
* install necessary packages: pip install fastapi uvicorn sqlalchemy psycopg2-binary
* set up databse conenction
* create models and schemas
* implement API endpoints for each feature 

3. Develop Frontend:
* create basic UI components for each feature
* implement API call to our backend
* basic styling 

4. Deploy:
* set up PostgreSQL (render, railway, or any other provider)
* deploy backend to Render
* deploy frontend to REnder as separate service 

## Why we use seperate Hashtags table?
Hashtags deserve their own table for several important reasons:
1. Reusability: Multiple tweets use the same hashtags. Storing them 2.separately prevents duplication.
2. Searchability: Makes it much easier to search tweets by hashtag.
3. Analytics: Enables tracking trending hashtags.
4. Data integrity: Ensures hashtags are consistent across tweets.

The many-to-many relationship through a junction table (tweet_hashtags) is the most normalized approach. When users create tweets, your application would:
1. Parse the tweet content to extract hashtags (e.g., using regex to find words starting with #)
2. For each hashtag, check if it exists in the hashtags table:
   * If it exists, get its ID
   * If not, insert it and get the new ID
3. create entries in the tweet_hashtags junction table linking the tweet to each hashtag

### Outline of the databse tables and their attributes for our Twitter clone applicaiton, focusing on text-only tweets (no media uploads)
1. Users table 
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    profile_picture_url VARCHAR(255),// ignore 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

2. Tweets table
CREATE TABLE tweets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

3. Hastags Table
CREATE TABLE hashtags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

4. Tweet_Hastags Table (junction Table)
CREATE TABLE tweet_hashtags (
    tweet_id INTEGER REFERENCES tweets(id) ON DELETE CASCADE,
    hashtag_id INTEGER REFERENCES hashtags(id) ON DELETE CASCADE,
    PRIMARY KEY (tweet_id, hashtag_id)
);

5. Followers Tbale (optional - when we have time)
CREATE TABLE follows (
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

## Relationship Diagram
1. One-to-Many: User → Tweets (A user can have many tweets, but each tweet belongs to one user)
2. Many-to-Many: Tweets ↔ Hashtags (A tweet can have multiple hashtags, and a hashtag can be used in multiple tweets)
3. Many-to-Many: Users ↔ Users (A user can follow many users, and can be followed by many users)

### Justification for our table design
1. Normalization Benefits
* Reduced Redundancy: Hashtags are stored once, regardless of how many tweets use them
* Improved Data Integrity: Changes to a hashtag (e.g., fixing a typo) affect all related tweets
* Better Query Performance: Searching for tweets with a specific hashtag is faster with a dedicated table

2. Separation of Concerns
* Each table has a clear, single responsibility
* Tables represent real-world entities, making the schema intuitive

3. Scalability
* This structure supports future expansion (e.g., adding likes, retweets, comments)
* The hashtag system can easily track trending topics

4. Efficient Queries
* Finding tweets by hashtag: Join tweet_hashtags with tweets
* Finding users to follow: Query the follows table
* Listing a user's tweets: Simple filter on user_id

5. Data Integrity with Foreign Keys
* ON DELETE CASCADE ensures referential integrity (e.g., if a tweet is deleted, its hashtag associations are also removed)
* Eliminates orphaned records

6. Support for Required Features
This schema supports all the required features from your assignment:
* Post/Edit/Delete tweets (CRUD operations on tweets table)
* List/Show tweets (SELECT from tweets)
* Search for tweets (Full text search on content)
* Search for hashtags (Query hashtags table)
* Make account (INSERT into users)
* List accounts (SELECT from users)
* Search for account (Query users table)

Here's a detailed explanation for each table in our Twitter clone database design:

### Users Table Explanation
1. **Data Centralization**: Stores all user-related information in one place, ensuring we have a single source of truth for user data.
2. **Authentication & Security**: Separating user credentials from other data enhances security and allows for proper password hashing.
3. **Profile Management**: Having dedicated fields for profile information makes it easy to display user profiles and implement profile editing functionality.
4. **User Discovery**: With a dedicated users table, implementing the "list accounts" and "search for account" features becomes straightforward.
5. **Relationship Foundation**: Acts as the foundation for ownership (who created what content) and social relationships (who follows whom).

### Tweets Table Explanation
1. **Content Management**: Centralizes tweet content, making it easy to perform CRUD operations.
2. **Timeline Construction**: Enables efficient retrieval of tweets for a user's timeline by filtering on user_id.
3. **Search Capability**: Having tweet content in a dedicated table allows for full-text search across all tweets.
4. **Audit Trail**: Timestamps track when tweets were created and last updated, supporting the edit history feature.
5. **Simple API Structure**: Maps cleanly to REST endpoints like GET /tweets/{id} and PUT /tweets/{id}.

### Hashtags Table Explanation
1. **Reusability**: Multiple tweets can use the same hashtag. Storing hashtags once prevents duplicating the same text across many tweets.
2. **Searchability**: Makes it much easier to find tweets with specific hashtags - crucial for the "search for hashtags" requirement.
3. **Trending Analysis**: Enables counting how many tweets use each hashtag, supporting trending hashtags functionality.
4. **Data Integrity**: Ensures consistent hashtag spelling and formatting across all tweets.
5. **Storage Efficiency**: Hashtags like #programming might appear in thousands of tweets; storing it once saves space.

### Tweet_Hashtags Junction Table Explanation
1. **Many-to-Many Relationship**: Properly represents that many tweets can have many hashtags, following database normalization principles.
2. **Query Flexibility**: Allows queries in both directions - "find all hashtags for a tweet" and "find all tweets with a hashtag."
3. **Metadata Isolation**: Keeps the relationship metadata separate from both tweets and hashtags, respecting single responsibility principle.
4. **Efficient Updates**: If a user edits a tweet to add or remove hashtags, only this table needs modification, not the tweet content itself.
5. **Implementation Process**: The application would:
   - Parse tweet content with regex to extract hashtags
   - Check if each hashtag exists in the hashtags table
   - Insert new hashtags if needed
   - Create records in this junction table linking the tweet ID to each hashtag ID

### Follows Table Explanation (Optional)
1. **Self-Referential Relationship**: Represents users following other users without creating a separate entity.
2. **Social Graph**: Forms the basis of the social network aspect of Twitter.
3. **Timeline Construction**: Enables retrieving tweets from followed users to build a user's home timeline.
4. **Follower Metrics**: Makes it easy to count followers and following for user profiles.
5. **Connection Management**: Supports following/unfollowing functionality with simple insert/delete operations.

This normalized database structure adheres to best practices for relational databases while supporting all the required Twitter clone functionality. The separation of concerns across tables makes the system more maintainable and extensible for future enhancements in assignment 2.

Source we used on when decided whteher to go for Flask or FastApi:
https://www.turing.com/kb/fastapi-vs-flask-a-detailed-comparison

---
Reason for why we need __init__.py in each folder for backend:

Python handles import differently. When we are running a file directly (like with python app.py once we are in the backend direcotry in the temrinal), Python does not treat it as part of a package, so relative imports with dots like (.config.db) dont work. 

In Python, we need __init-_.py files to mark direcotries as pakcges, which enables Python's import system to work corecctly with relative imports. 

so for exmaple comapring it to JS ES6 way of how we know that works, we do something like this: 
// user.js
export default class User {...}
// app.js
import User from './models/user.js';

In python it would look somehting like this:
# models/user.py
class User: 
    ...
# app.py
from models.user import User

A "package" in Python is jsut a direcotry that Python recognizes as containing importable code. When you create empty __init__.py files, you are essentially telling Python "treat this folder as a module that i can import from." -> this folder is not jsut for organizing files, it contians code modules. 

so when we use: 
- from models.user import User in app.py
Python: 
1. Looks for a models direcotry
2. checks if it has an __init__.py (confirming its a package)
3. the looks for a user.py file insinde that pakcge
4. imports the User class from that file

and also the reason we have non-dots for imports is because python will look for modules like config.db directly in the backend folder, which is where they are located once we decalre that we are in the backend folder in the terminal. 

For authentication in a Python FastAPI application, I would recommend using JSON Web Tokens (JWT). Here's why:

1. Industry Standard: JWT is widely adopted and has good library support in Python.
2. Stateless: Unlike session-based authentication, JWT doesn't require server-side storage, making it easier to scale.
3. Cross-domain: JWTs work well across different domains, which is helpful if you'll have separate frontend and backend services.
4. Rich Information: You can embed user information (like roles, permissions) directly in the token.
5. Library Support: Python has excellent libraries for JWT like python-jose and PyJWT.