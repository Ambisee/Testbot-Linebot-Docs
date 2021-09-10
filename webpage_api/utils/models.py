from .db import db

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False, unique=True)
    functions = db.relationship('Function', backref="category", lazy=True)


class Function(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    function_category = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(500), nullable=False)
    syntax = db.Column(db.String(100), nullable=False)
    user_chat = db.Column(db.String(500), nullable=False)
    bot_chat = db.Column(db.String(500), nullable=False)


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(500), nullable=False)
    admin = db.Column(db.Boolean, nullable=False, default=False)