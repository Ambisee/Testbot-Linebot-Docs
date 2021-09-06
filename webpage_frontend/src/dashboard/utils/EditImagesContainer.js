import React, { useRef, useState } from 'react';
import ImageDisplayer from './ImageDisplayer.js';
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
                            The keyword that will be used to call the image from the bot.
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
            <form method="POST" className="upload" action="#" encType="multipart/form-data">
                <input
                    type="file"
                    name="filepath"
                    accept="image/jpeg, image/png"
                    ref={fileReceiver}
                    onChange={(e) => readUI(e)}
                />
                {previewImg()}
            </form>
            <div className="image-gallery">
                <ImageDisplayer name="Cat" src="https://img.webmd.com/dtmcms/live/webmd/consumer_assets/site_images/article_thumbnails/other/cat_relaxing_on_patio_other/1800x1200_cat_relaxing_on_patio_other.jpg" />
                <ImageDisplayer src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/2048px-Solid_white.svg.png" />
                <ImageDisplayer src="https://timesofindia.indiatimes.com/photo/67586673.cms" />
                <ImageDisplayer src="https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=0d3f33fb6aa6e0154b7713a00454c83d" />
            </div>
        </div>
    )
}
