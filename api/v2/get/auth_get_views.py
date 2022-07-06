from flask import Blueprint, jsonify, make_response, session
from flask_wtf.csrf import generate_csrf

auth_get_views = Blueprint('auth_get_views', __name__, url_prefix='/auth')

@auth_get_views.route('/current-user', methods=['GET'])
def current_user():
    """
    /api/v2/get/auth/login
    
    Description:
    Returns the credential of currently signed-in user
    """
    return jsonify({
        'user': session.get('user', None),
        'is_admin': session.get('is_admin', None)
    }), 200


@auth_get_views.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    """
    /api/v2/get/auth/csrf-token

    Description:
    Get a CSRF Token from the server
    """
    # Reset the CSRF Token in the session if there's no user
    if not session.get('user', None) and 'csrf_token' in session.keys():
        session.pop('csrf_token')

    # Transmit the CSRF Token through the response header
    response = make_response()
    response.headers.add('X-CSRFToken', generate_csrf())

    return response
