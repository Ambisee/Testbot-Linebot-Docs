from flask import Blueprint

from .db_post_views import db_post_views
from .auth_post_views import auth_post_views

post = Blueprint('post_routes', __name__, url_prefix='/post')

post.register_blueprint(auth_post_views)
post.register_blueprint(db_post_views)
