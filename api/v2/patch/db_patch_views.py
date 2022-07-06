from flask import Blueprint, jsonify, request


from ...database.db import db
from ...database.models import Category, Function
from api.v2.decorators import check_login, validate_json
from ..code import NO_CONTENT_FOUND, NO_SEARCH_PARAM, UNKNOWN_ERROR,\
    generate_status, ERROR, INFO, CONTENT_MODIFIED

db_patch_views = Blueprint('db_patch_views', __name__, url_prefix='/db')

@db_patch_views.route(
    '/category', 
    methods=['PATCH'],
    defaults={'category_id': -1}
)
@db_patch_views.route(
    '/category/<int:category_id>',
    methods=['PATCH']
)
@check_login
@validate_json
def patch_category(category_id):
    """
    /api/v2/patch/db/category/<int:category_id>

    Description:
    Rename a category
    """
    if category_id <= -1:
        return jsonify({
            'message': 'Category ID was not given',
            'status': generate_status(ERROR, NO_SEARCH_PARAM)
        }), 400
    
    # Retrieve the request data as JSON
    payload = request.get_json()

    search_result = Category.query.filter_by(_id=category_id).first()

    # Check if the targeted query exists
    if search_result is None:
        return jsonify({
            'message': 'Category not found',
            'status': generate_status(ERROR, NO_CONTENT_FOUND)
        }), 404

    search_result._category_name = payload.get('category_name')
    
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Error: {str(e)}',
            'status': generate_status(ERROR, UNKNOWN_ERROR)
        }), 400
    
    return jsonify({
        'message': 'Successfully modified the category name',
        'status': generate_status(INFO, CONTENT_MODIFIED)
    }), 200


@db_patch_views.route(
    '/command', 
    methods=['PATCH'],
    defaults={'category_id': -1}
)
@db_patch_views.route(
    '/command/<int:command_id>',
    methods=['PATCH']
)
@check_login
@validate_json
def patch_command(command_id):
    """
    /api/v2/patch/db/command/<int:command_id>

    Description:
    Modify the content of a Function
    """
    if command_id <= -1:
        return jsonify({
            'message': 'Category ID was not given',
            'status': generate_status(ERROR, NO_SEARCH_PARAM)
        }), 400
    
    payload = request.get_json()

    target = Function.query.filter_by(_id=command_id).first()
    if target is None:
        return jsonify({
            'message': 'Command not found',
            'status': generate_status(ERROR, NO_CONTENT_FOUND)
        }), 404

    target._name = payload.get('name')
    target._description = payload.get('description')
    target._syntax = payload.get('syntax')
    target._user_chat = payload.get('user_chat')
    target._bot_chat = payload.get('bot_chat')

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Error: {str(e)}',
            'status': generate_status(ERROR, UNKNOWN_ERROR)
        }), 400
    
    return jsonify({
        'message': 'Successfully modified the command',
        'status': generate_status(INFO, CONTENT_MODIFIED)
    }), 200
