import os
from .utils.config import *
from .utils.db import *
from .utils.models import *
from flask import Flask, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

if os.getenv('FLASK_ENV') == 'development':
    app.config.from_object(DevelopmentConfig)
else:
    app.config.from_object(ProductionConfig)

if app.config.get("SQLALCHEMY_DATABASE_URI"):
    init_db(app)

@app.route('/modify-command', methods=["POST", "PATCH"])
def modify_command():
    """
    POST :
    Create a new function from the received information
    and add it into the database.

    PATCH :
    Search for the function with the received information
    and modify the contents.
    """
    if request.method == "PATCH":
        body = request.get_json()
        result = Function.query.filter_by(name=body['name'])
        print(result)
        return jsonify({}), 200

    return jsonify({}), 200


@app.route('/handle-login', methods=["GET", "POST"])
def handle_login():
    """
    GET :
    Returns the username of the current user and
    the user's admin access.
    
    POST :
    Try to log in with the information obtained 
    from the input fields. If successful, redirect to
    dashboard.
    """
    if request.method == 'GET':
        return jsonify({
            'user': session.get('user', None),
            'admin': session.get('admin', None)
        })

    if request.method == "POST":
        if session.get('user'):
            return redirect('/dashboard')
        username = request.form['username']
        password = request.form['password']

        matched_user = User.query.filter_by(username=username).all()
        if len(matched_user) <= 0:
            return redirect('/portal')

        matched_user = matched_user[0]
        password_match = check_password_hash(matched_user.password, password)
        if password_match:
            session['user'] = username
            if matched_user.admin:
                session['admin'] = True
            session.modified = True
            print(session)
            return redirect('/dashboard')
        
        return redirect('/portal')
    
    return


@app.route('/handle-logout', methods=["GET"])
def handle_logout():
    """
    GET :
    Signs out from current user and 
    redirects user to portal page.
    """
    if len(session) <= 0:
        return redirect('/portal')

    session.pop('user')
    session.pop('admin')
    print('logged out')
    return redirect('/portal')


@app.route('/display-commands', methods=['GET'])
def display_commands():
    """
    GET :
    Returns a JSON object with each category as keys and 
    an array of dictionaries of the categories' commands as values.
    """
    package = {}
    for category in Category.query.all():
        package[category.category_name] = list(
            map(
                lambda row:
                    {
                        "name": row.name,
                        "description": row.description,
                        "syntax": row.syntax,
                        "userChat": row.user_chat,
                        "botChat": row.bot_chat
                    }
                , category.functions
            )
        )

    # Returns a dictionary with categories(str) as keys and list of dict as values
    return jsonify(package)