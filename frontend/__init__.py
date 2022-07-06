import os
from flask import Flask, render_template, send_file, make_response
from .utils.config import *

app = Flask(__name__)
current_config = os.getenv("FLASK_ENV")

if current_config == 'development':
    app.config.from_object(DevelopmentConfig)
else:
    app.config.from_object(ProductionConfig)


# Webpage Icon Route
@app.route('/favicon.ico')
def icon():
    return send_file('static/images/favicon.ico')


# Webpage Routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def app_routing(path):
    response = make_response(
        render_template('index.html', config=current_config, app_name=os.getenv('APP_NAME'))
    )
    
    return response
