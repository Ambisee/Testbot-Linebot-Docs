from flask import Blueprint
from .auth_get_views import auth_get_views
from .db_get_views import db_get_views

get = Blueprint('get_routes', __name__, url_prefix='/get')

get.register_blueprint(auth_get_views)
get.register_blueprint(db_get_views)
