import React,
{
    useState,
    useEffect,
    useReducer
} from 'react';

import ImageDisplayer from './ImageDisplayer.js';
import ImageReceiver from './ImageReceiver.js';
import Loading from './Loading.js';
import {
    READ_INPUT_FILE,
    REMOVE_INPUT_FILE,
    ON_CHANGE_FILENAME
} from './dispatcherCode.js';

import './css/EditImagesContainer.css';

function reducer(state, action) {
    switch (action.eventType) {
        case READ_INPUT_FILE:
            return { ...state, fileObject: action.payload, fileName: action.payload.name.split('.')[0] };
        case REMOVE_INPUT_FILE:
            return { ...state, fileObject: null, fileName: null };
        case ON_CHANGE_FILENAME:
            return { ...state, fileName: action.e.target.value };
        default:
            return {...state};
    }
}

export default function EditImagesContainer(props) {
    const [state, dispatch] = useReducer(reducer, { fileObject: null, fileName: null });
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [doReload, setDoReload] = useState(false);
    const [images, setImages] = useState([]);
    
    const submitFile = () => {
        if (state.fileName == '') {
            alert('Please provide a Filename');
        }

        let data = new FormData();
        data.append('name', state.fileName);
        data.append('file', state.fileObject);

        const requestOptions = {
            method: 'POST',
            body: data
        }
        
        setLoadingUpload(current => !current)
        fetch('/dropbox-api/upload-image', requestOptions)
            .then(response => {
                setLoadingUpload(false);
                return response.json();
            })
            .then(data => {
                dispatch({ eventType: REMOVE_INPUT_FILE });
                setDoReload(current => !current);
            });
    }

    useEffect(() => {
        fetch('/dropbox-api/get-all-image-link')
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                setImages(data.data)
            })
    }, [doReload])

    let imageUploadConfirmation = () => {
        if (state.fileObject !== null) {
            return (
                <div className="controller">
                    <div>
                        <span>Filename</span>
                        <span>
                            The keyword that will be used to call the image from the bot.
                        </span>
                        <input name="name" type="text" onChange={(e) => dispatch({ eventType: ON_CHANGE_FILENAME, e: e })} value={state.fileName} />
                        {loadingUpload && <Loading />}
                    </div>
                    <button type="submit" className="icon-button" onClick={submitFile}>
                        <span>&#10004; Submit</span>
                    </button>
                </div>
            )
        }
    }

    return (
        <div className="images-container">
            <div className="container-header">
                <h1>Edit Images</h1>
            </div>
            <div className="upload">
                <ImageReceiver stateDispatch={[state, dispatch]} />
                {imageUploadConfirmation()}
            </div>
            <div className="image-gallery">
                {images.length > 0 ?
                    images.map(tup => (
                        <ImageDisplayer
                            key={tup[0]}
                            name={tup[0].split('_').join(' ')}
                            file_ext={tup[1]}
                            src={tup[2]}
                            onDelete={() => setDoReload(current => !current)} 
                        />
                    )) :
                    <Loading />
                }
            </div>
        </div>
    )
}
