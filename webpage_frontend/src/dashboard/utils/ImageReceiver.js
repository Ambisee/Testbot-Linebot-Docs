import React, { useState } from 'react';
import { states } from './EditImagesContainer.js';
import './css/ImageReceiver.css';

export default function ImageReceiver({ filePathRef = null, filePath = null, dispatch = (obj) => {} }) {
    const [localFilePathStorage, setLocalFilePathStorage] = useState(null);
    
    const readUI = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                filePathRef !== null ? dispatch({ filePath: ev.target.result }) : setLocalFilePathStorage(ev.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        filePathRef !== null ? dispatch({ filePath: null }) : setLocalFilePathStorage(null)
    }
    
    return (
        <div className="image-receiver">
            <input
                type="file"
                accept="image/jpeg, image/png"
                ref={filePathRef}
                onChange={(e) => readUI(e)}
            ></input>
            {localFilePathStorage !== null || filePath !== null ?
                <div>
                    <img src={filePathRef !== null ? filePath : localFilePathStorage}></img>
                </div> :
                <></>
            }
        </div>
    )
}
