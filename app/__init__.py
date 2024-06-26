import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.users_cardio_exercise_routes import user_cardio_exercise_routes
from .api.user_weight_exercise_routes import user_weight_exercise_versions_routes
from .api.cardio_exercise_routes import cardio_exercise_routes
from .api.weight_exercise_routes import weight_exercise_routes
from .api.food_routes import food_routes
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-app/build', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(cardio_exercise_routes, url_prefix="/api/cardio-exercises")
app.register_blueprint(weight_exercise_routes, url_prefix="/api/weight-exercises")
app.register_blueprint(food_routes, url_prefix="/api/foods")
app.register_blueprint(user_cardio_exercise_routes, url_prefix="/api/users-cardio-exercises")
app.register_blueprint(user_weight_exercise_versions_routes, url_prefix="/api/users-weight-exercises")
db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)

# CORS doesn't allow unapproved clients to make requests to your server.
# A preflight request is made to the server BEFORE the actual request
# to determine whether or not the actual request is safe to send or not.
# This request will include the Origin header.

# The server sends back a response to the preflight request which includes a
# Access-Control-Allow-Origin header. If the response's Access-Control-Allow-Origin header's
# pattern matches the value of the preflight request's Origin header, the browser will make the actual request.

# If it does not match, the browser will block the request
# and thus NOT send the actual request. Keep in mind this only happens
# if the browser supports CORS.


# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.errorhandler(403)
def unauthorized(e):
    return app.send_static_file('index.html')
