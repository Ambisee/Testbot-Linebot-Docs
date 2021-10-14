import React, { useRef, useState, useEffect, useReducer } from 'react';
import ImageDisplayer from './ImageDisplayer.js';
import ImageReceiver from './ImageReceiver.js';
import Loading from './Loading.js';
import './css/EditImagesContainer.css';

function reducer(state, action) {
    return {filePath: action.filePath};
}

export default function EditImagesContainer(props) {
    const [state, dispatch] = useReducer(reducer, { filePath: null });
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [doReload, setDoReload] = useState(false);
    const [images, setImages] = useState([]);
    const fileNameRef = useRef("");
    const fileReceiver = useRef(0);
    
    const submitFile = () => {
        if (fileNameRef.current.value == '') {
            alert('Please provide a Filename');
        }

        let data = new FormData();
        data.append('name', fileNameRef.current.value);
        data.append('file', fileReceiver.current.files[0])

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
                dispatch({ filePath: null });
                fileReceiver.current.value = null;
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
        const removeFile = () => {
            dispatch({ filePath: null });
            fileReceiver.current.value = null;
        }
        
        let defFileName = fileReceiver.current.value ? fileReceiver.current.value.split('\\').at(-1).split('.')[0] : null;
        
        return (defFileName !== null) ? (
            <div className="controller">
                <div>
                    <span>Filename</span>
                    <span>
                        The keyword that will be used to call the image from the bot.
                    </span>
                    <input name="name" type="text" ref={fileNameRef} defaultValue={defFileName} />
                    {loadingUpload ? 
                        <Loading /> :
                        <></>
                    }  
                </div>
                <button className="icon-button" onClick={removeFile}>
                    <span>&times; Remove</span>
                </button>
                <button type="submit" className="icon-button" onClick={submitFile}>
                    <span>&#10004; Submit</span>
                </button>
            </div>
            ) :
            null;
    }

    return (
        <div className="images-container">
            <div className="container-header">
                <h1>Edit Images</h1>
            </div>
            <div className="upload">
                <ImageReceiver filePathRef={fileReceiver} filePath={state.filePath} dispatch={dispatch} />
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
