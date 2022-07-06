from flask import Blueprint, request, session, jsonify, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from flask_wtf.csrf import generate_csrf

from ...database.models import db, Account
from api.v2.decorators import check_admin, check_login
from ..code import UNKNOWN_ERROR, generate_status, LOGIN_SUCCESSFUL, \
    LOGIN_FAILED, INVALID_DATA, LOGOUT_SUCCESSFUL, LOGOUT_FAILED, INFO, ERROR 

auth_post_views = Blueprint('auth_post_views', __name__, url_prefix='/auth')

@auth_post_views.route('/new-user', methods=['POST'])
@check_admin
@check_login
def create_new_user():
    """
    /api/v2/post/auth/new-user

    Description:
    Create a new user
    """
    # Get JSON credentials sent in the request body
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({
            'message': 'Request body is not in JSON format',
            'status': generate_status(ERROR, INVALID_DATA)
        }), 400
    
    username = payload.get('username', None)
    password = payload.get('password', None)
    
    # TEMPORARY
    if not (username and password):
        return jsonify({
            'message': 'Username or password is empty',
            'status': generate_status(ERROR, INVALID_DATA)
        })
    
    password = generate_password_hash(password)

    new_user = Account(_username=username, _password=password, _is_admin=True)
    
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Error: {str(e)}',
            'status': generate_status(ERROR, UNKNOWN_ERROR)
        }), 400

    return jsonify({
        'message': 'New user created',
        'status': generate_status(INFO, 'Hello')
    })

@auth_post_views.route('/login', methods=['POST'])
def login():
    """
    /api/v2/post/auth/login

    Description:
    Log in the user with the given credentials
    """
    # Get the JSON credentials sent in the request body
    payload = request.get_json(silent=True)
    if payload is None:
        return jsonify({
            'message': 'Request body is not in JSON format',
            'status': generate_status(ERROR, INVALID_DATA)
        }), 400

    username = payload.get('username', None)
    password = payload.get('password', None)

    # Try to find a user that matches the username
    matched_user = Account.query.filter_by(_username=username).all()    
    if len(matched_user) <= 0:
        return jsonify({
            'message': 'Invalid username or password',
            'status': LOGIN_FAILED
        }), 401

    # Validate the user's password
    matched_user = matched_user[0]
    password_match = check_password_hash(matched_user._password, password)

    # Log the user in if the password matches
    if not password_match:
        # Return a response saying that logging failed
        return jsonify({
            'message': 'Invalid username or password',
            'status': generate_status(ERROR, LOGIN_FAILED)
        }), 401
    
    # Reset CSRF Token
    session.pop('csrf_token')

    session['user'] = username
    session['is_admin'] = True if matched_user._is_admin else False
    
    session.modified = True

    # Creating a response object and inserting the response body
    response = make_response(
        jsonify({
            'user': session['user'],
            'is_admin': session['is_admin'],
            'csrf_token': generate_csrf(),
            'message': 'User successfully logged in',
            'status': generate_status(INFO, LOGIN_SUCCESSFUL)
        })
    )
    
    # Adding headers etc. to the response
    response.status_code = 200

    return response
    

@auth_post_views.route('/logout', methods=['POST'])
def logout():
    """
    /api/v2/post/auth/logout

    Description:
    Log the user out and returns a success message and status
    """
    # Check if a user is currently logged in
    if len(session) < 0:
        return jsonify({
            'message': 'No user currently logged in',
            'status': generate_status(ERROR, LOGOUT_FAILED) 
        }), 204
    
    # Unset the user's session data
    session.pop('user')
    session.pop('is_admin')
    session.pop('csrf_token')

    return jsonify({
        'message': 'User successfully logged out',
        'status': generate_status(INFO, LOGOUT_SUCCESSFUL)
    }), 200
