import os
from flask import Flask, render_template, redirect, session, send_file
from .utils.config import *

app = Flask(__name__)
if os.getenv("FLASK_ENV") == 'development':
    app.config.from_object(DevelopmentConfig)
else:
    app.config.from_object(ProductionConfig)

# Webpage Icon Route
@app.route('/favicon.ico')
def icon():
    return send_file('static/images/favicon.ico')


# Webpage Routes
@app.route('/')
def home():
    return render_template('index.html', title="TestBot | Home")


@app.route('/about')
def about():
    return render_template('index.html')


@app.route('/portal')
def portal():
    return render_template('index.html')


@app.route('/dashboard')
def dashboard():
    return render_template('index.html')


@app.route('/dashboard/<string:section>')
def dashboard_section(section):
    return render_template('index.html')


@app.route('/create-user')
def create_user():
    if not session.get('admin'):
        return redirect('/')
    
    return render_template('index.html')
