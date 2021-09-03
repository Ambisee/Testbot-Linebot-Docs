import React, { useRef, useState } from 'react';
import './css/EditImagesContainer.css';

export default function EditImagesContainer(props) {
    const [receivedFilePath, setReceivedFilePath] = useState(null);
    const [receivedFileName, setReceivedFileName] = useState('');
    const fileReceiver = useRef(0);
    
    const readUI = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (ev) => {
                setReceivedFilePath(ev.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    let previewImg = () => {
        const removeFile = () => {
            setReceivedFilePath(null);
            fileReceiver.current.value = null;
        }
        
        let defFileName = fileReceiver.current.value ? fileReceiver.current.value.split('\\') : null;
        return (receivedFilePath != null) && (defFileName != null) ? (
            <div className="previewer">
                <img src={receivedFilePath} alt="No preview"></img>
                <div className="controller">
                    <div>
                        <span>Filename</span>
                        <span>
                            The keyword that will be used to conjure up the image from the bot.
                        </span>
                        <input type="text" onChange={(e) => setReceivedFileName(e.target.value)} defaultValue={defFileName?.[defFileName.length - 1].split('.')[0]} />
                    </div>
                    <button className="icon-button" onClick={removeFile}>
                        <span>&times; Remove</span>
                    </button>
                    <button type="submit" className="icon-button">
                        <span>&#10004; Submit</span>
                    </button>
                </div>
            </div>
            ) :
            null;
    }

    return (
        <div className="images-container">
            <div className="container-header">
                <h1>Edit Images</h1>
            </div>
            <form method="POST" className="upload">
                <input
                    type="file"
                    name="filepath"
                    accept="image/jpeg, image/png"
                    ref={fileReceiver}
                    onChange={(e) => readUI(e)}
                />
                {previewImg()}
            </form>
        </div>
    )
}
