import os
import dropbox
from werkzeug.utils import secure_filename
from flask import Flask, request

app = Flask(__name__)
dbx = dropbox.Dropbox(os.getenv('DROPBOX_TOKEN'))

# File Getter and Setter
@app.route('/get-image-link/<filename>', methods=['GET'])
def get_image_link(filename):
    return 'hello', 200


@app.route('/upload-image', methods=['POST'])
def upload_image():
    if request.method == 'POST':
        # Get all of the relevant information
        name = request.form.get('name')
        uploaded_file = request.files.get('file')
        filetype = uploaded_file.mimetype.split('/')[-1]
        filename = secure_filename(f'{name}.{filetype}')

        # Upload to Dropbox and create a link
        dbx.files_upload(uploaded_file.read(), f'/Images/{filename}', mode=dropbox.files.WriteMode.overwrite)
        link = dbx.sharing_create_shared_link(f'/Images/{filename}')

        return {
            'message': 'File successfully uploaded'
            'link': str(link.url.replace('www.dropbox', 'dl.dropboxusercontent'))
        }, 200
    
    return {'message': 'Request method not allowed...'}, 403