from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename

from ...database.db import db
from ...database.models import File, Function, Category
from ...firebase import upload_file
from api.v2.decorators import check_login, validate_json
from ..code import generate_status, CONTENT_CREATED, UNKNOWN_ERROR, \
    AWAITING_NEXT_CONTENT, INFO, ERROR, CONTENT_EXISTED

db_post_views = Blueprint(
    'db_post_views', 
    __name__, 
    url_prefix='/db'
)

@db_post_views.route('/category', methods=['POST'])
@check_login
@validate_json
def create_new_category():
    """
    /api/v2/post/db/category

    Description:
    Create a new command in the database
    """
    # Retrieve the request body in JSON format
    payload = request.get_json()

    # Check if a category with the name given already existed in the database
    if Category.query.filter_by(_category_name=payload.get('category_name')) \
            is not None:
        return jsonify({
            'message': 'A Category with that name has already existed in the \
                database',
            'status': generate_status(ERROR, CONTENT_EXISTED)
        }), 400
    
    # Create the new entry and try to insert it into the database
    new_category = Category(_category_name=payload.get('category_name'))

    try:
        db.session.add(new_category)
        db.session.commit()
    except Exception as e:
        db.session.rollback()        
        return jsonify({
            'message': f'Error: {str(e)}',
            'status': generate_status(ERROR, UNKNOWN_ERROR)
        }), 400
        
    return jsonify({
        'message': 'Category successfully created',
        'status': generate_status(INFO, CONTENT_CREATED)
    }), 201


@db_post_views.route('/command', methods=['POST'])
@check_login
@validate_json
def create_new_command():
    """
    /api/v2/post/db/command

    Description:
    Create a new command in the database
    """
    payload = request.get_json()

    new_function = Function(
        _name=payload.get('name'),
        _syntax=payload.get('syntax'),
        _description=payload.get('description'),
        _function_category=payload.get('functionCategory'),
        _user_chat_type=payload.get('userChatType'),
        _user_chat=payload.get('userChat'),
        _bot_chat_type=payload.get('botChatType'),
        _bot_chat=payload.get('botChat')
    )

    # Add the new function query into the table
    db.session.add(new_function)
    
    # Commit the changes in the database
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Error: {str(e)}',
            'status': generate_status(ERROR, UNKNOWN_ERROR)
        }), 400

    # Return a response stating that the server is waiting for the next
    # request with the files data
    if any(
        category in [
            'image', 'carousel'
        ]
        for category in [
            payload.get('user_chat_type'),
            payload.get('bot_chat_type')
        ]
    ):
        return jsonify({
            'function_id': new_function._id,
            'message': 'Expecting second request with form payload',
            'status': generate_status(INFO, AWAITING_NEXT_CONTENT)
        }), 201

    # Return a success response
    return jsonify({
        'message': 'Command successfully created',
        'status': generate_status(INFO, CONTENT_CREATED)
    }), 201


from ...csrf import csrf

@db_post_views.route(
    '/file',
    methods=['POST']
)
@csrf.exempt
# @check_login
def create_new_file():
    """
    /api/v2/post/db/file

    Description:
    Upload the file sent through the request
    to Firebase and store the web URL to the resource
    """
    form = request.form
    files = request.files

    print(form, files)

    # Upload the files and make new queries for
    # invocable resources
    for file in files.getlist('invocables'):
        file_binary = file.read()
        filetype = file.mimetype.split('/')[-1]
        filename = secure_filename(file.filename)
        
        # Upload the file to Firebase storage and return the URL
        file_url = upload_file(
            file_binary,
            f'Invocable Contents/{filename}'
        )

        # Create a new File entry in the database
        new_file = File(
            _filename=filename,
            _filepath=f'Invocable Contents/{filename}',
            _tag='invocable',
            _url=file_url,
        )

        db.session.add(new_file)

    # Check if the request comes with a function id
    if (row := Function.query.filter(
        Function._id == form.get('function_id', None)
    )).first() is not None:
        row = row.first()
        function_name = row._name

        for file in files.getlist('user'):
            file_binary = file.read()
            filetype = file.mimetype.split('/')[-1]
            filename = secure_filename(f'{file.filename}.{filetype}')
            function_id = form.get('function_id')
            
            # Upload the file to Firebase storage and return the URL
            file_url = upload_file(
                file_binary, 
                f'Chat Resources/{function_name[1:]}/User/{filename}'
            )

            # Create a new File entry in the database
            new_file = File(
                _filename=filename,
                _filepath=f'Chat Resources/{function_name[1:]}/ \
                    User/{filename}',
                _url=file_url,
                _tag='user',
                _association=function_id
            )

            db.session.add(new_file)
        
        for file in files.getlist('bot'):
            file_binary = file.read()
            filetype = file.mimetype.split('/')[-1]
            filename = secure_filename(f'{file.filename}.{filetype}')
            function_id = form.get('function_id')
            
            # Upload the file to Firebase storage and return the URL
            file_url = upload_file(
                file_binary, 
                f'Chat Resources/{function_name[1:]}/Bot/{filename}'
            )

            # Create a new File entry in the database
            new_file = File(
                _filename=filename,
                _filepath=f'Chat Resources/{function_name[1:]}/ \
                    Bot/{filename}',
                _url=file_url,
                _tag='bot',
                _association=function_id
            )

            db.session.add(new_file)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'message': f'Error: {str(e)}',
            'status': generate_status(ERROR, UNKNOWN_ERROR)
        }), 400

    return jsonify({
        'message': 'Files successfully uploaded',
        'status': generate_status(INFO, CONTENT_CREATED)
    }), 201
