import os
from dotenv import load_dotenv

if '.env' in os.listdir():
    load_dotenv('.env')

from werkzeug.serving import run_simple
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from webpage_api import app as webpage_api_app
from webpage_frontend import app as webpage_frontend_app

application = DispatcherMiddleware(webpage_frontend_app, {
    '/webpage-api': webpage_api_app
})

if __name__ == '__main__' and os.getenv('FLASK_ENV') == 'development':
    run_simple('localhost',
                8000,
                application,
                use_debugger=True,
                use_evalex=True,
                use_reloader=True)