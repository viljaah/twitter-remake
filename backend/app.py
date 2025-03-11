from flask import Flask

# to initialize the flask app we use __name__
app = Flask(__name__)

# routes related to user_routes.py




# launches the server by running the script (this should be on the bottom of the page)
if __name__ == '__main__':
    app.run(debug=True) # should we have debug=True?