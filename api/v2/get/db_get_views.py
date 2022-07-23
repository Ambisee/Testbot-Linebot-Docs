from flask import Blueprint, jsonify

from ...database.models import Category, Function
from ..code import CONTENT_FOUND, NO_SEARCH_PARAM, generate_status, \
    NO_CONTENT_FOUND, INFO, ERROR, INVALID_DATA

db_get_views = Blueprint('db_get_views', __name__, url_prefix='/db')

@db_get_views.route('/all-categories', methods=['GET'])
def get_all_categories():
    """
    /api/v2/get/db/all-categories

    Description:
    Return all category names from the database
    """
    # Get the 'Miscellaneous' Category query
    miscellaneous = Category.query.filter_by(_category_name='Miscellaneous') \
        .first()

    # Check if the Category table has any content at all
    if miscellaneous is None:
        return jsonify({
            'message': 'No content found',
            'status': generate_status(INFO, NO_CONTENT_FOUND)
        }), 204

    # Get the rest of the Category queries
    all_categories = Category.query.filter(Category._id != miscellaneous._id) \
        .all()

    payload = {
        'categories': list(
            map(
                lambda entry: {
                    'id': entry._id, 
                    'category_name': entry._category_name
                },
                all_categories
            )
        )
    }

    return jsonify({
        **payload,
        'message': 'Resources found',
        'status': generate_status(INFO, CONTENT_FOUND)
    }), 200


@db_get_views.route('/all-commands', methods=['GET'])
def get_all_commands():
    """
    /api/v2/get/db/all-commands

    Description:
    Get all command queries from the database 
    """
    # Serialize each query of the command queries and insert them
    # into a dictionary.
    payload = {}
    for category in Category.query.all():
        payload[category._category_name] = list(
            map(
                lambda row: {
                    'id': row._id,
                    'name': row._name,
                    'description': row._description,
                    'syntax': row._syntax,
                    'userChatType': row._user_chat_type,
                    'userChat': row._user_chat,
                    'botChatType': row._bot_chat_type,
                    'botChat': row._bot_chat,
                    'files': list(
                        map(
                            lambda file: {
                                'filename': file._filename,
                                'tag': file._tag,
                                'url': file._url
                            },
                            row._files
                        )
                    )
                }, 
                category._functions
            )
        )

    # Returns the payload dictionary in JSON format. 
    return jsonify(payload), (200 if len(payload) > 0 else 204)

@db_get_views.route(
    '/category-commands/', 
    defaults={'category_id': -1}, 
    methods=['GET']
)
@db_get_views.route(
    '/category-commands/<int:category_id>',
    methods=['GET']
)
def get_category_commands(category_id):
    """
    /api/v2/get/db/category-commands/<int:category_id>

    Description:
    Get all of the commands under a category specified 
    by the ID given in the URL parameter
    """
    # Check if the `category_id` given is a valid integer
    if not isinstance(category_id, int):
        return jsonify({
            'message': 'Values in the URL parameter is invalid',
            'status': generate_status(ERROR, INVALID_DATA)
        }), 400
    
    if category_id <= -1:
        return jsonify({
            'message': 'Category ID was not given',
            'status': generate_status(ERROR, NO_SEARCH_PARAM)
        }), 400

    # Get a category query from the database
    search_result = Category.query.filter_by(_id=category_id).first()
    if search_result is not None:
        payload = {}
        payload['commands'] = list(
            map(
                lambda row: {
                    'id': row._id,
                    'name': row._name,
                    'description': row._description,
                    'syntax': row._syntax,
                    'userChatType': row._user_chat_type,
                    'userChat': row._user_chat,
                    'botChatType': row._bot_chat_type,
                    'botChat': row._bot_chat,
                    'files': list(
                        map(
                            lambda file: {
                                'filename': file._filename,
                                'url': file._url
                            },
                            search_result._files
                        )
                    )
                },
                search_result.functions
            )
        )

        return jsonify(payload), 200

    return jsonify({
        'message': 'No category name found with the specified ID',
        'status': generate_status(INFO, NO_CONTENT_FOUND)
    }), 204


@db_get_views.route(
    '/command/',
    defaults={'command_id': -1},
    methods=['GET']
)
@db_get_views.route(
    '/command/<int:command_id>',
    methods=['GET']
)
def get_command(command_id):
    """
    /api/v2/get/db/command/<int:command_id>

    Description:
    Returns a command from the database specified with the ID
    """
    if not isinstance(command_id, int):
        return jsonify({
            'message': 'Values in the URL parameter is invalid',
            'status': generate_status(ERROR, INVALID_DATA)
        }), 400

    if command_id <= -1:
        return jsonify({
            'message': 'Command ID was not given',
            'status': generate_status(ERROR, NO_SEARCH_PARAM)
        }), 400
    
    search_result = Function.query.filter_by(_id=command_id)

    if search_result is not None:
        search_result = search_result.first()
        return jsonify({
            'id': search_result._id,
            'name': search_result._name,
            'syntax': search_result._syntax,
            'description': search_result._description,
            'userChatType': search_result._user_chat_type,
            'userChat': search_result._user_chat,
            'botChatType': search_result._bot_chat_type,
            'botChat': search_result._bot_chat,
            'files': list(
                map(
                    lambda file: {
                        'filename': file._filename,
                        'url': file._url
                    },
                    search_result._files
                )
            )
        }), 200

    return jsonify({
        'message': 'Command not found',
        'status': generate_status(ERROR, NO_CONTENT_FOUND)
    }), 200
