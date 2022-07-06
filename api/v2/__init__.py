from flask import Blueprint

from .get import get
from .post import post
from .delete import delete
from .patch import patch

v2_api = Blueprint('v2', __name__, url_prefix='/v2')

v2_api.register_blueprint(get)
v2_api.register_blueprint(post)
v2_api.register_blueprint(delete)
v2_api.register_blueprint(patch)