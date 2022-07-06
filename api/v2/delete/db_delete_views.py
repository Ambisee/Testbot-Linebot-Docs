from flask import Blueprint, jsonify, request
from sqlalchemy.sql.elements import or_

from ...database.db import db
from ...firebase import delete_files
from ..decorators import check_login, validate_json
from ...database.models import Category, File, Function
from ..code import INVALID_DATA, NO_CONTENT_FOUND, UNKNOWN_ERROR, \
    generate_status, INFO, ERROR, CONTENT_DELETED

db_delete_views = Blueprint('db_views', __name__, url_prefix='/db')

@db_delete_views.route(
    '/category/',
    defaults={'category_id': -1},
    methods=['DELETE']
)
@db_delete_views.route(
    'category/<int:category_id>',
    methods=['DELETE']
)
@check_login
def delete_category(category_id):
    """
    /api/v2/delete/db/category/<int:category_id>

    Description:
    Delete a category and the command below the category 
    specified by the `category_id`
    """
    if not isinstance(category_id, int):
        return jsonify({
            'message': 'Values in the URL parameter is invalid',
            'status': generate_status(ERROR, INVALID_DATA)
        }), 400

    if category_id == -1:
        return jsonify({
            'message': 'Category not found',
            'status': generate_status(ERROR, NO_CONTENT_FOUND)
        }), 204

    search_result = Category.query.filter_by(_id=category_id).first()
    if search_result is not None:
        try:
            for function in search_result._functions:
                delete_files(*[file._filepath for file in function._files])
                map(
                    lambda entry: db.session.delete(entry), 
                    function._files
                )
                
                db.session.delete(function)
            
            db.session.delete(search_result)
            db.session.commit()

            return jsonify({
                'message': 'Deletion of category successful',
                'status': generate_status(INFO, CONTENT_DELETED)
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'message': f'Error: {str(e)}',
                'status': generate_status(ERROR, UNKNOWN_ERROR)
            }), 400
    
    return jsonify({
        'message': 'Category not found',
        'status': generate_status(ERROR, NO_CONTENT_FOUND)
    }), 204


@db_delete_views.route(
    '/command/',
    defaults={'command_id': -1},
    methods=['DELETE']
)
@db_delete_views.route(
    '/command/<int:command_id>',
    methods=['DELETE']
)
@check_login
def delete_command(command_id):
    """
    /api/v2/delete/db/command/<int:command_id>

    Description:
    Delete a command specified by its id from the database
    """
    if not isinstance(command_id, int):
        return jsonify({
            'message': 'Values in the URL parameter is invalid',
            'status': generate_status(ERROR, INVALID_DATA)
        }), 400

    if command_id == -1:
        return jsonify({
            'message': 'Command ID was not given',
            'status': generate_status(ERROR, NO_CONTENT_FOUND)
        }), 400

    search_result = Function.query.filter_by(_id=command_id).first()
    if search_result is not None:
        try:
            delete_files(*[file._filepath for file in search_result._files])
            map(
                lambda entry: db.session.delete(entry),
                search_result._files
            )

            db.session.delete(search_result)
            db.session.commit()

            return jsonify({
                'message': 'Command successfully deleted',
                'status': generate_status(INFO, CONTENT_DELETED)
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({
                'message': f'Error: {str(e)}',
                'status': generate_status(ERROR, UNKNOWN_ERROR)
            }), 400

    return jsonify({
        'message': 'Command not found',
        'status': generate_status(ERROR, NO_CONTENT_FOUND)
    }), 204


from ...csrf import csrf

@db_delete_views.route(
    '/file',
    methods=['DELETE']
)
# @check_login
@csrf.exempt
@validate_json
def delete_file():
    """
    /api/v2/delete/db/file

    Description:
    Delete singles or multiple files from Firebase storage and the database
    """
    payload = request.get_json()
    query_filter = [
        File._filename.contains(filename)
        for filename in payload.get('filenames')
    ]

    # Search for the row with the specified filenames
    result = File.query.filter(
        or_(
            *query_filter
        )
    )

    # Check if the querying yield at least one row
    if result.first() is None:
        return jsonify({
            'message': 'Command not found',
            'status': generate_status(ERROR, NO_CONTENT_FOUND)
        }), 204

    delete_files(*[row._filepath for row in result.all()])
    result.delete(synchronize_session=False)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Error: {str(e)}',
            'status': generate_status(ERROR, UNKNOWN_ERROR)
        }), 400
    
    return jsonify({
        'message': 'File(s) successfully deleted',
        'status': generate_status(INFO, CONTENT_DELETED)
    }), 200
