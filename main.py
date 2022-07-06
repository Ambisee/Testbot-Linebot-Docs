import os
from dotenv import load_dotenv

if '.env' in os.listdir():
    load_dotenv('.env')

from werkzeug.serving import run_simple
from werkzeug.middleware.dispatcher import DispatcherMiddleware

from api import app as api_app
from frontend import app as frontend_app
from webpage_api import app as webpage_api_app
from dropbox_api import app as dropbox_api_app

application = DispatcherMiddleware(frontend_app, {
    '/webpage-api': webpage_api_app,
    '/dropbox-api': dropbox_api_app,
    '/api': api_app
})

if __name__ == '__main__' and os.getenv('FLASK_ENV') == 'development':
    run_simple(
        'localhost',
        8000,
        application,
        use_debugger=True,
        use_evalex=True,
        use_reloader=True,
        threaded=True
    )