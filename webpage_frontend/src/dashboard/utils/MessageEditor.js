import React, { useState, useEffect, useRef, useReducer } from 'react';
import ImageReceiver from './ImageReceiver.js';
import './css/MessageEditor.css';

function reducer(state, action) {
    return { filePath: action.filePath };
}

export default function MessageEditor({ elementRef = null, message = null }) {
    const [state, dispatch] = useReducer(reducer, { filePath: null });
    const [newMessage, setNewMessage] = useState(message);
    const [mode, setMode] = useState(0);
    const fileNameRef = useRef(0);
    const fileReceiver = useRef(0);
    
    useEffect(() => {
        if (message.includes('dl.dropboxusercontent')) {
            setMode(1);
        }
    }, [])

    const readUI = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (ev) => {
                setReceivedFilePath(ev.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
            return;
        }
        setReceivedFilePath(null);
        return;
    }

    const selectEditorMode = () => {
        switch (mode) {
            case 0:
                return (
                    <textarea ref={elementRef} value={message} onChange={(e) => { setNewMessage(e.target.value) }}></textarea>
                );
            case 1:
                return (
                    <div>
                        <ImageReceiver filePathRef={elementRef} filePath={state.filePath} dispatch={dispatch} />
                    </div>
                );
            case 2:
                return;
        }
    }

    return (
        <div className="message-editor">
            <header>
                <button onClick={() => setMode(0)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
                        <path id="I-Beam_1" data-name="I-Beam 1" className="primary-feature" d="M335.381,136.25H471.149v60.713h48.494V136.25H665.124v64.214H519.649V799.787H665.124V864H519.643V803.288c-3.6,0-38.715-.8-48.494-0.8V864H335.381V799.787H471.157V200.464H335.381C335.174,174.153,335.382,154.143,335.381,136.25Z"/>
                    </svg>
                </button>
                <button onClick={() => setMode(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
                        <path id="Image_Icon_1" data-name="Image Icon\ 1" className="primary-feature" d="M127.167,136H866.252C894.914,136,925,149.827,925,190.979v362.1c0,55.374,0,225.354,0,257.834C925,843.625,896.1,864,875.728,864H140.433C94.092,864,76,845.717,76,799.542c0-29.56,0-74.318,0-121.334V189.083C76,159.577,100.519,136,127.167,136Zm36.007,60.667c-7.248,0-26.531,7.226-26.531,26.541V712.333c64.426-76.457,161.089-194.646,225.515-271.1C378.235,420.611,384.866,409,409.536,409c21.575,0,31.668,15.33,43.587,28.437,25.375,27.908,51.305,54.064,75.8,81.521,12.16,13.629,25.056,30.334,43.587,30.334,22.739,0,59.836-51.188,79.594-51.188,16.1,0,63.806,53.346,77.7,68.25,56.51,60.621,115.239,125.031,134.551,145.979,0-122.585-1.895-249-1.895-371.583,0-16.056,1.895-88.313,1.895-125.125,0-10.976-17.572-18.958-26.531-18.958-23.5,0-118.73,0-153.5,0H163.174ZM712.75,257.333c55.639,0,90.964,42.81,90.964,92.9,0,51.6-44.761,89.1-89.069,89.1-55.731,0-92.859-40.23-92.859-92.9C621.786,299.112,663.726,257.333,712.75,257.333Z"/>
                    </svg>
                </button>
            </header>
            <div>
               {selectEditorMode()}
            </div>
        </div>
    )
}
