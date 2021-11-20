import React, { useState } from 'react';
import { READ_INPUT_FILE, REMOVE_INPUT_FILE } from './dispatcherCode.js';
import './css/ImageReceiver.css';

export default function ImageReceiver({ dispatch = null }) {
    const [localFilePathStorage, setLocalFilePathStorage] = useState(null);

    const readInput = (e) => {
        const fileExist = (e.target.files && e.target.files[0]);
        if (fileExist) {
            dispatch !== null ? dispatch({ eventType: READ_INPUT_FILE, payload: e.target.files[0] }) : null;
            setLocalFilePathStorage(URL.createObjectURL(e.target.files[0]));
            console.log('hello')
            return;
        }
        setLocalFilePathStorage(null);
        dispatch !== null ? dispatch({ eventType: REMOVE_INPUT_FILE }) : null;

        return;
    }

    return (
        <div className="image-receiver">
            <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={readInput}
            ></input>
            {localFilePathStorage ?
                <img src={localFilePathStorage} lodaing="lazy" /> :
                <></>
            }
        </div>
    );
}
