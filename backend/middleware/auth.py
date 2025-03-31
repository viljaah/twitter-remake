'''
What is JWT?
JWT stands for JSON Web Token. It's a compact, URL-safe means of representing claims between two parties. In the context of authentication:

When a user logs in successfully, the server creates a JWT containing user information (like user ID, roles)
The server signs this token with a secret key and sends it to the client
The client stores this token (typically in localStorage or cookies)
For subsequent requests, the client sends this token in the Authorization header
The server verifies the token's signature to authenticate the user

How JWT Authentication Works in FastAPI

Login Process:

User sends username and password
Server verifies credentials
If valid, server creates a JWT with user info and signs it
The token is returned to the client


Protected Route Access:

When the user tries to access a protected route, they include the JWT in their request header
The get_current_user dependency extracts and verifies the token
If valid, it retrieves the user from the database
The route handler receives the authenticated user


Middleware Flow:

FastAPI's dependency injection system acts as middleware
The Depends(get_current_user) parameter dependency runs before the route handler
If authentication fails, it returns a 401 error before your route code runs

When you implement JWT later:

You have a few options for logout:
a) Client-side only: The client simply deletes the stored token
b) Token blacklisting: The server maintains a list of invalidated tokens
c) Short token expiration with refresh tokens: Main tokens expire quickly, refresh tokens can be invalidated

'''

'''
Look for articles that specifically cover:

Basic JWT concepts (tokens, claims, signing)
Implementing login with JWT in FastAPI
Using FastAPI dependencies for protected routes
Token refresh strategies

good articles: 
https://medium.com/@kevinkoech265/jwt-authentication-in-fastapi-building-secure-apis-ce63f4164eb2

'''
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/login')