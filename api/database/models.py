from .db import db


class Category(db.Model):
    """
    db.Model: Category
    
    Description:
    Table for querying the category of bot commands

    Columns:
    _id: db.Integer = 
        the primary key for each entry
    _category_name: db.String = 
        the category's name
    _functions: db.relationship =
        associate entries from the Function table 
        to the corresponding category
    """
    _id = db.Column(db.Integer, primary_key=True)
    _category_name = db.Column(db.String(100), nullable=False, unique=True)
    _functions = db.relationship(
        "Function", 
        backref="category",
        lazy=True,
        cascade="all, delete, delete-orphan"
    )


class Function(db.Model):
    """
    db.Model: Function

    Description:
    Table for querying data about bot functions

    Columns:
    _id: db.Integer =
        the primary key for each entry
    _function_category: db.Integer =
        primary key of a Category to which
        the Function belong to        
    _name: db.String =
        name of the Function
    _description: db.String =
        detailed description of the Function
    _syntax: db.String =
        proper syntax for evocation of the Function
    _files: db.relationship =
        list of associations to entries in the File table
    _user_chat: db.String =
        displayed user message for evocation of the Function (text format)
    _user_chat_type: db.Enum =
        displayed user message type. 
        Types:
            - Text
            - Image
            - Carousel
    
    _bot_chat: db.String =
        displayed bot message for evocation of the Function (text format)
    _bot_chat_type: db.Enum = 
        displayed user message type. 
        Types:
            - Text
            - Image
            - Carousel
    """
    _id = db.Column(db.Integer, primary_key=True)

    _function_category = db.Column(
        db.Integer, 
        db.ForeignKey("category._id"), 
        nullable=False
    )

    _name = db.Column(db.String(100), nullable=False, unique=True)
    _description = db.Column(db.String(500), nullable=False)
    _syntax = db.Column(db.String(100), nullable=False)
    _files = db.relationship(
        "File", 
        backref="function", 
        lazy=True,
        cascade="all, delete, delete-orphan"
    )

    _user_chat = db.Column(db.String(500))
    _user_chat_type = db.Column(
        db.Enum('text', 'image', 'carousel'),
        nullable=False,
        default='text'
    )
    
    _bot_chat = db.Column(db.String(500))
    _bot_chat_type = db.Column(
        db.Enum('text', 'image', 'carousel'), 
        nullable=False,
        default='text'
    )


class File(db.Model):
    """
    db.Column: File

    Description:
    Table querying stored file URLs for retrieval

    Column:
    _id: db.Integer =
        primary key for an entry
    _filename: db.String =
        a filename used to represent the file
    _filepath: db.String =
        a filepath in Firebase storage where the file is located
    _url: db.String =
        the web URL where the file is located
    _tag: db.Enum = 
        shows to which side the image will be used
        Sides :
            - User
            - Bot
    _association: db.Integer =
        a foreign key that maps to the associated Function
    """
    _id = db.Column(db.Integer, primary_key=True)
    _filename = db.Column(db.String(100), nullable=False, unique=True)
    _filepath = db.Column(db.String(500), nullable=False, unique=True)
    _url = db.Column(db.String(500), nullable=False)
    _tag = db.Column(db.String(100))
    _association = db.Column(
        db.Integer,
        db.ForeignKey('function._id'),
        nullable=True
    )


class Account(db.Model):
    """
    db.Model: Account

    Description:
    Table containing user accounts

    Columns:
    _id: db.Integer =
        primary key for each entry
    _username: db.String =
        an account's username
    _password: db.String =
        an account's password (hashed)
    _is_admin: db.Boolean =
        representation of the presence of an account's 
        administrative privileges
    """
    _id = db.Column(db.Integer, primary_key=True)
    _username = db.Column(db.String(50), nullable=False, unique=True)
    _password = db.Column(db.String(500), nullable=False)
    _is_admin = db.Column(db.Boolean, nullable=False, default=False)
