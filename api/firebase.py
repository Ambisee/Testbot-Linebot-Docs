import os
import json

# from dotenv import load_dotenv
from firebase_admin import initialize_app
from firebase_admin.credentials import Certificate
from firebase_admin import storage

# load_dotenv('.env')

def initialize_firebase():
    """
    initialize_firebase:
    Intialize connection to firebase and define functions
    to be used in the application

    @params:
    No parameters
    
    @return:
    No return value
    """
    global rename_file
    global upload_file
    global delete_files
    global get_file_url

    rename_file = None
    upload_file = None
    delete_files = None
    get_file_url = None

    # Read credentials from environment variables
    service_account = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    firebase_config = os.getenv('FIREBASE_CONFIG')

    if service_account is None or firebase_config is None:
        print("Service account key or Firebase config is not available")
        return

    # Create the credential objects
    service_account = json.loads(service_account)
    firebase_config = json.loads(firebase_config)

    cred = Certificate(service_account)
    initialize_app(credential=cred, options=firebase_config)

    bucket = storage.bucket()

    def rename_file(original_path: str, new_path: str) -> None:
        """
        rename_file:
        Rename a file in the Firebase storage bucket

        @params:
        - original_path: str = the target filepath inside 
            Firebase storage (e.g. root/foo/bar.jpg)
        - new_path: str = the new filepath that will replace
            the targeted file
        
        @return:
        No return value
        """
        target_blob = bucket.blob(original_path)
        bucket.rename_blob(target_blob, new_path)
        return

    def upload_file(file_binary: str, destination_path: str):
        """
        upload_file:
        Create a new file and upload it into the Firebase 
        storage bucket

        @params:
        - file_binary: str = the binaries of a file to be uploaded
        - destination_path: str = the target filepath inside Firebase
            storage to store the file into
        
        @return:
        A public URL to the newly uploaded file
        """
        new_blob = bucket.blob(destination_path)
        new_blob.upload_from_file(file_binary)
        new_blob.make_public()
        
        return new_blob.public_url

    def get_file_url(filepath: str):
        """
        get_file_url:
        Get the public URL of a resource on Firebase storage

        @params:
        - filepath: str = the path to the file in Firebase storage
        
        @return:
        A public URL to the specified file
        """
        target = bucket.blob(filepath)
        return target.public_url

    def delete_files(*target_paths):
        """
        delete_file:
        Delete a single or multiple files in the 
        Firebase storage bucket

        @params:
        - target_paths = the target files in the bucket to be
            deleted
        
        @return:
        No return values
        """
        if len(target_paths) == 0:
            return

        if len(target_paths) == 1:
            bucket.delete_blob(target_paths[0])
            return

        bucket.delete_blobs(target_paths)
        return

    return


initialize_firebase()
