import React, { useRef, useState, useEffect } from 'react';
import ImageDisplayer from './ImageDisplayer.js';
import './css/EditImagesContainer.css';

export default function EditImagesContainer(props) {
    const [receivedFile, setReceivedFile] = useState(null);
    const fileReceiver = useRef(0);
    
    const readUI = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (ev) => {
                setReceivedFile(ev.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    const onChangeFileInput = (e) => {
        readUI(e);
    }

    return (
        <div className="images-container">
            <div className="container-header">
                <h1>Edit Images</h1>
            </div>
            <form method="POST" className="upload">
                <input
                    type="file"
                    accept="image/jpeg, image/png"
                    ref={fileReceiver}
                    onChange={(e) => onChangeFileInput(e)}
                />
                <img src={receivedFile} alt="No preview"></img>
            </form>
        </div>
    )
}
