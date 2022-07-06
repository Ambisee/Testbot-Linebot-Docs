from flask import Flask
import os

from .v2 import v2_api
from .csrf import csrf
from .config import config_map
from .database.db import init_db

app = Flask(__name__)

app_config = os.getenv('FLASK_ENV')
app.config.from_object(config_map[app_config])

csrf.init_app(app)
init_db(app)

app.register_blueprint(v2_api)
