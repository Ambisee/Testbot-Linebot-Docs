from functools import wraps
from flask import session, request, jsonify

from .code import generate_status, ERROR, NO_USER, UNAUTHORIZED_ACCESS, \
    INVALID_DATA

def check_login(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        """
        Check if the user is logged in
        """
        if not session.get('user', None):
            return jsonify({
                'message': 'No user is currently logged in',
                'status': generate_status(ERROR, NO_USER)
            }), 401
        
        return func(*args, **kwargs)
    
    return decorated_func


def check_admin(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        """
        Check for administrator privileges
        """
        if not session.get('isAdmin', None):
            return jsonify({
                'message': 'No administrative priveleges found',
                'status': generate_status(ERROR, UNAUTHORIZED_ACCESS)
            }), 403
        
        return func(*args, **kwargs)
    return decorated_func


def validate_json(func):
    @wraps(func)
    def decorated_func(*args, **kwargs):
        """
        Validate that request data is in JSON format
        """
        payload = request.get_json(silent=True)

        if payload is None:
            return jsonify({
                'message': 'Request data is not in the JSON format',
                'status': generate_status(ERROR, INVALID_DATA)
            }), 400
        
        return func(*args, **kwargs)
    
    return decorated_func
