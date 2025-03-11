from flask import Flask
from .routes.api_v1 import api_v1_bp


# to initialize the flask app we use __name__
app = Flask(__name__)
# routes that are defined in api_v1_bp related to routes
app.register_blueprint(api_v1_bp, url_prefix='/api/v1')


# launches the server by running the script (this should be on the bottom of the page)
if __name__ == '__main__':
    app.run(debug=True) # should we have debug=True?