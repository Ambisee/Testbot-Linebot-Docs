import os
from .utils.config import *
from .utils.db import *
from .utils.models import *
from flask import Flask, jsonify, request, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

if os.getenv('FLASK_ENV') == 'development':
    app.config.from_object(DevelopmentConfig)
else:
    app.config.from_object(ProductionConfig)


if app.config.get('SQLALCHEMY_DATABASE_URI'):
    init_db(app)


# Login/logout handlers
@app.route('/handle-login', methods=['GET', 'POST'])
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

    if request.method == 'POST':
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


@app.route('/handle-logout', methods=['GET'])
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


# Command handlers
@app.route('/get-all-commands', methods=['GET'])
def display_all_commands():
    """
    GET :
    Returns a JSON object with each category as keys and 
    an array of dictionaries of the categories' commands as values.
    """
    payload = {}
    for category in Category.query.all():
        payload[category.category_name] = list(
            map(
                lambda row:
                    {
                        'id': row.id,
                        'name': row.name,
                        'description': row.description,
                        'syntax': row.syntax,
                        'userChat': row.user_chat,
                        'botChat': row.bot_chat,
                    }, category.functions
            )
        )

    # Returns a dictionary with categories(str) as keys and list of dict as values
    return jsonify(payload)


@app.route('/modify-command', methods=['POST', 'PATCH', 'DELETE'])
def modify_command():
    """
    POST :
    Create a new function from the information requested
    and add it into the database.

    PATCH :
    Search for the function with the information requested
    and modify the contents.

    DELETE :
    Search for the function with the information requested
    and delete the record
    """
    if request.method == 'PATCH':
        body = request.get_json()
        print(repr(body.get('description')))
        search_result = Function.query.filter_by(
            syntax=body.get('original_syntax')).first()
        if search_result is not None:
            search_result.name = body.get('name')
            search_result.description = body.get('description')
            search_result.syntax = body.get('syntax')
            search_result.user_chat = body.get('user_chat')
            search_result.bot_chat = body.get('bot_chat')

            db.session.commit()

            return jsonify({'message': 'Successfully modified the content of the command.'}), 200

        return jsonify({'message': 'Command not found.'}), 404

    if request.method == 'POST':
        body = request.get_json()
        new_function = Function(
            name=body.get('name'),
            function_category=body.get('function_category'),
            description=body.get('description'),
            syntax=body.get('syntax'),
            user_chat=body.get('user_chat'),
            bot_chat=body.get('bot_chat')
        )
        
        db.session.add(new_function)
        db.session.commit()

        return jsonify({'message': 'Command successfully created'}), 201

    if request.method == 'DELETE':
        body = request.get_json()
        search_result = Function.query.filter_by(name=body.get('name')).first()
        if search_result is not None:
            db.session.delete(search_result)
            db.session.commit()

            return jsonify({'message': 'Command successfully deleted'}), 200

        return jsonify({'message': 'Command not found'}), 404

    return jsonify({'message': 'Request method not allowed...'}), 403


# Category handlers
@app.route('/get-all-categories')
def get_all_category():
    """
    GET : 
    Returns a list of all category keywords
    """
    all_categories = Category.query.all()
    payload = {
        'categories': list(map(lambda row: {'id': row.id,'name': row.category_name}, all_categories))
    }
    return jsonify(payload), 200


@app.route('/find-category-commands/', defaults={'category_id': 0}, methods=['GET'])
@app.route('/find-category-commands/<category_id>', methods=['GET'])
def find_category_commands(category_id):
    """
    GET : 
    Returns a list of all commands under the
    given category
    """
    if category_id == 0:
        return jsonify({'message': 'No category name provided'}), 204


    if request.method == 'GET':
        search_result = Category.query.filter_by(id=category_id).first()
        if search_result is not None:
            payload = {'commands': []}
            payload['commands'] = list(map(lambda row:
                    {
                        'id': row.id,
                        'name': row.name,
                        'description': row.description,
                        'syntax': row.syntax,
                        'userChat': row.user_chat,
                        'botChat': row.bot_chat
                    },
                search_result.functions
            ))

            return jsonify(payload), 200
        return jsonify({'message': 'Category not found'}), 404
    return jsonify({'message': 'Request method not allowed...'}), 400
        

@app.route('/modify-category', methods=['POST', 'PATCH'])
def modify_category():
    """
    POST :
    Create a new category and inserts it
    into the database

    PATCH :
    Modify the category with information requested
    """
    body = request.get_json()
    if body.get('original_name', None) is None:
        return jsonify({'message': 'Category not found'}), 404


    if request.method == 'POST':
        new_category = Category(category_name=body.get('new_name'))
        db.session.add(new_category)
        db.session.commit()

        return jsonify({'message': 'Category successfully created'}), 201


    if request.method == 'PATCH':
        search_result = Category.query.filter_by(category_name=body.get('original_name')).first()
        if search_result is not None:
            search_result.category_name = body.get('new_name')
            db.session.commit()

            return jsonify({'message': 'Successfully modified the category name'}), 200
        return jsonify({'message': 'Category not found'}), 404
    return jsonify({'message': 'Request method not allowed...'}), 403


@app.route('/delete-category', methods=['DELETE'])
def delete_category():
    """
    DELETE :
    Delete the category given in the request's JSON body
    with all of its commands
    """
    if request.method == 'DELETE':
        body = request.get_json()
        search_result = Category.query.filter_by(category_name=body.get('category_name')).first()
        if search_result is not None:
            for function in search_result.functions:
                db.session.delete(x)
            db.session.delete(search_result)
            db.session.commit()

            return jsonify({'message': 'Deletion of category successful'}), 200
        
        return jsonify({'message': 'Category not found'}), 204

    return jsonify({'message': 'Request method not allowed...'}), 403
