import os
import argparse
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
    parser = argparse.ArgumentParser(
        description='Run the development server for the \
            Testbot-Comcenter documentation web application'
    )
    
    parser.add_argument( 
        '--host', 
        help='Configure a hostname to run the application',
        default='localhost'
    )
    parser.add_argument(
        '--port', 
        help='Configure a port number to run the application',
        default=8000
    )
    
    arguments = parser.parse_args()

    run_simple(
        arguments.host,
        int(arguments.port),
        application,
        use_debugger=True,
        use_evalex=True,
        use_reloader=True,
        threaded=True
    )
