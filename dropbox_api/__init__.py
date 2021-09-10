import os
import dropbox
from werkzeug.utils import secure_filename
from flask import Flask, request

app = Flask(__name__)
dbx = dropbox.Dropbox(os.getenv('DROPBOX_TOKEN'))


# File Getter and Setter
@app.route('/get-all-image-link', methods=['GET'])
def get_all_image_link():
    linkObj = dbx.sharing_get_shared_links().links
    
    linkObj = list(filter(lambda obj: obj.path.endswith('.png') or obj.path.endswith('.jpg'), linkObj))
    payload = {}
    payload['data'] = list(
        map(
            lambda obj: 
                (
                    *obj.path.split('/')[-1].split('.'),
                    obj.url.replace('www.dropbox', 'dl.dropboxusercontent'),
                )
            , linkObj
        )
    )

    return payload


@app.route('/upload-image', methods=['POST'])
def upload_image():
    if request.method == 'POST':
        # Get all of the relevant information
        name = request.form.get('name').capitalize()
        uploaded_file = request.files.get('file')
        filetype = uploaded_file.mimetype.split('/')[-1]
        filename = secure_filename(f'{name}.{filetype}')

        # Upload to Dropbox and create a link
        dbx.files_upload(uploaded_file.read(), f'/Images/{filename}', mode=dropbox.files.WriteMode.overwrite)
        link = dbx.sharing_create_shared_link(f'/Images/{filename}')

        return {
            'message': 'File successfully uploaded',
            'name': str(name),
            'file_ext': str(filetype),
            'link': str(link.url.replace('www.dropbox', 'dl.dropboxusercontent'))
        }, 200
    
    return {'message': 'Request method not allowed...'}, 403


@app.route('/delete-image', methods=['DELETE'])
def delete_image():
    if request.method == 'DELETE':
        target = request.get_json().get('deletion_target')
        print(f'/Images/{target}')
        if target is not None:
            try:
                dbx.files_delete(f'/Images/{target}')
                return {'message': 'File successfully deleted'}, 200
            except dropbox.exceptions.ApiError as e:
                print(e)
                return {'message': 'Target file not found'}, 404

    return {'message': 'Request method not allowed...'}, 403