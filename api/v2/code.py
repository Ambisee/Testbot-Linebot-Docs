# General Error
UNKNOWN_ERROR = 'An unknown error occured'
INVALID_DATA = 'Invalid data received'

# Authentication Status Message
USER_FOUND = 'Found logged in user'
NO_USER = 'No user logged in'
LOGIN_SUCCESSFUL = 'Login successful'
LOGIN_FAILED = 'Login failed'
LOGOUT_SUCCESSFUL = 'Logout successful'
LOGOUT_FAILED = 'Logout failed'

# Content Access Status Message
NO_SEARCH_PARAM = 'No search parameter given'
CONTENT_FOUND = 'Content found'
NO_CONTENT_FOUND = 'No content found'
UNAUTHORIZED_ACCESS = 'Access to the content requested is forbidden'

# Content Mutation Status Message
CONTENT_EXISTED = 'Content existed'
CONTENT_CREATED = 'Content created'
CONTENT_MODIFIED = 'Content modified'
CONTENT_DELETED = 'Content deleted'
UNAUTHORIZED_ACTION = 'Unauthorized action'
AWAITING_NEXT_CONTENT = 'Awaiting next content'
PROCESS_FAILED = 'Process failed'

# Severity Code
INFO = 'Info'
WARNING = 'Warning'
ERROR = 'Error'

def generate_status(severity: str, status_message: str) -> dict:
    """
    generate_status:
    Generate a status dictionary that will be
    part of a response

    @params:
    - severity: str = severity level of the effects the request has
        on the server
    - status_message: str = predefined status message that shows
        the status of the request
    """
    return {
        'status_message': status_message,
        'severity': severity
    }
