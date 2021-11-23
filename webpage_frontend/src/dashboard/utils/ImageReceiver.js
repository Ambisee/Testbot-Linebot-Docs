import React, { useRef, useState } from 'react';
import { READ_INPUT_FILE, REMOVE_INPUT_FILE } from './dispatcherCode.js';
import './css/ImageReceiver.css';

export default function ImageReceiver({ stateDispatch=[] }) {
    const [state, dispatch] = stateDispatch.length == 2 ? stateDispatch : [null, null];
    const [localFilePathStorage, setLocalFilePathStorage] = useState(null);
    const inputRef = useRef();

    const readInput = (e) => {
        const fileReceived = (e.target.files && e.target.files[0]);
        if (fileReceived) {
            dispatch !== null ?
                dispatch({ eventType: READ_INPUT_FILE, payload: e.target.files[0] }) :
                setLocalFilePathStorage(URL.createObjectURL(e.target.files[0]));
            return;
        }
        dispatch !== null ?
            dispatch({ eventType: REMOVE_INPUT_FILE }) :
            setLocalFilePathStorage(null);
        return;
    }


    const fileExists = state.fileObject !== null || (localFilePathStorage !== null);
    return (
        <div className="image-receiver">
            <div>
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={readInput}
                    ref={inputRef}
                ></input>
                <div className="file-handler-buttons">
                    <button className="upload-button" onClick={() => inputRef.current.click()}>Upload File</button>
                    {fileExists ?
                        <button className="remove-button" onClick={() => dispatch({eventType: REMOVE_INPUT_FILE})}>Remove File</button> :
                        <></>
                    }
                </div>
            </div>
            {fileExists ?
                <img src={state?.fileObject !== undefined ? URL.createObjectURL(state.fileObject) : localFilePathStorage} /> :
                <></>
            }
        </div>
    );
}
