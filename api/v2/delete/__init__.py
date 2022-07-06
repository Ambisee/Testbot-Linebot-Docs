from flask import Blueprint

from .db_delete_views import db_delete_views

delete = Blueprint('delete', __name__, url_prefix='/delete')

delete.register_blueprint(db_delete_views)
