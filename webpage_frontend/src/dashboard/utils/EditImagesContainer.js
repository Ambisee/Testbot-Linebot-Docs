import React, { useRef, useState, useEffect } from 'react';
import ImageDisplayer from './ImageDisplayer.js';
import './css/EditImagesContainer.css';

export default function EditImagesContainer(props) {
    const [receivedFilePath, setReceivedFilePath] = useState(null);
    const [images, setImages] = useState([]);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [doReload, setDoReload] = useState(false);
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
                setReceivedFilePath(null);
                fileReceiver.current.value = null;
                setDoReload(current => !current);
            });
    }

    const readUI = (e) => {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (ev) => {
                setReceivedFilePath(ev.target.result);
            }
            reader.readAsDataURL(e.target.files[0]);
        }
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

    let previewImg = () => {
        const removeFile = () => {
            setReceivedFilePath(null);
            fileReceiver.current.value = null;
        }
        
        let defFileName = fileReceiver.current.value ? fileReceiver.current.value.split('\\').at(-1).split('.')[0] : null;
        
        return (receivedFilePath != null) && (defFileName != null) ? (
            <div className="previewer">
                <img src={receivedFilePath} alt="No preview"></img>
                <div className="controller">
                    <div>
                        <span>Filename</span>
                        <span>
                            The keyword that will be used to call the image from the bot.
                        </span>
                        <input name="name" type="text" ref={fileNameRef} defaultValue={defFileName} />
                        {loadingUpload ? 
                            <div className="upload-loading">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="132.5 0 735 1000">
                                    <path id="Bot_Logo_1" data-name="Bot Logo 1" className="primary-feature" d="M861.958,251.738C709.317,144.606,474.007-20.047,505.634,1.983,385.932,88.048,263.377,174.139,143.676,260.2,261.5,343.447,382.176,426.715,500,509.958,532.064,486.7,861.691,253.9,861.958,251.738ZM131,282.78L487.324,532.535c-0.469,155.669.265,312.388,0,468.465-1.147-1.355-3.286-3.293-4.225-4.233L131,749.835V282.78ZM511.267,999.589V533.946C628.622,451.643,749.7,366.792,869,282.78c0,19.487.018,92.21,0,111.473V748.424C751.176,830.726,541.881,978.1,511.267,999.589ZM194.378,498.67c-61.81,23.6-2.548,201.653,60.561,176.38C300.384,638.537,251.959,490.763,194.378,498.67Zm547.866,1.411c-11.116,5.533-23.057,7.039-30.984,15.521,0,41.857-.11,83.181-0.11,125.038,29.573-20.693,59.6-39.88,89.175-60.573,0.489-20.433-3.774-43.206-11.6-57.41C779.883,506.623,765.793,499.483,742.244,500.081ZM342.259,604.5c-60.343,22.5-5.14,197.726,59.153,177.791C448.7,753.276,405.913,599.563,342.259,604.5Zm369,36.687c-29.1,21.163-61.034,43.744-90.138,64.908-0.766,91.506,63.784,86.46,90.138,62.085C710.79,726.322,711.729,683.041,711.26,641.185Z" />
                                    <path id="Shape_321_1" data-name="Shape 321 1" className="secondary-feature" d="M201.063,496.907c47.041,0,66.5,76.523,69.655,90.747,11.458,51.711-.559,82.347-18.438,90.748-28.092,11.8-60.578-29.271-74.776-71.155C160.3,556.488,165.031,496.907,201.063,496.907Zm600.255,83.529c-28.678,19.935-60.465,40.269-89.143,60.2H711.15c-0.287-28.236-1-105.253-1-126.2C738.9,489.61,803.278,486.078,801.318,580.436Zm-454.8,23.718c39.045,0,67.84,61.517,73.751,97.966,8.4,51.827-7,80.2-21.511,84.56-28.463,6.62-61.158-30.212-75.8-78.373C308.172,659.675,315.189,604.154,346.518,604.154Zm365.671,36.489c0.327,42.617-.329,87.949.013,130.569-57.014,38.679-92.96,1.952-92.19-64.967,29.363-21.406,61.3-45.041,91.138-65.605C711.767,640.64,711.727,640.643,712.189,640.643Z" />
                                </svg>
                            </div> :
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
                <input
                    type="file"
                    name="filepath"
                    accept="image/jpeg, image/png"
                    ref={fileReceiver}
                    onChange={(e) => readUI(e)}
                />
                {previewImg()}
            </div>
            <div className="image-gallery">
                {images.length > 0 ?
                    images.map(tup => (
                        <ImageDisplayer
                            key={tup[0]}
                            name={tup[0]}
                            file_ext={tup[1]}
                            src={tup[2]}
                            onDelete={() => setDoReload(current => !current)} />
                    )) :
                    <svg xmlns="http://www.w3.org/2000/svg" width="735" height="1000" viewBox="132.5 0 735 1000">
                        <path id="Bot_Logo_1" data-name="Bot Logo 1" className="primary-feature" d="M861.958,251.738C709.317,144.606,474.007-20.047,505.634,1.983,385.932,88.048,263.377,174.139,143.676,260.2,261.5,343.447,382.176,426.715,500,509.958,532.064,486.7,861.691,253.9,861.958,251.738ZM131,282.78L487.324,532.535c-0.469,155.669.265,312.388,0,468.465-1.147-1.355-3.286-3.293-4.225-4.233L131,749.835V282.78ZM511.267,999.589V533.946C628.622,451.643,749.7,366.792,869,282.78c0,19.487.018,92.21,0,111.473V748.424C751.176,830.726,541.881,978.1,511.267,999.589ZM194.378,498.67c-61.81,23.6-2.548,201.653,60.561,176.38C300.384,638.537,251.959,490.763,194.378,498.67Zm547.866,1.411c-11.116,5.533-23.057,7.039-30.984,15.521,0,41.857-.11,83.181-0.11,125.038,29.573-20.693,59.6-39.88,89.175-60.573,0.489-20.433-3.774-43.206-11.6-57.41C779.883,506.623,765.793,499.483,742.244,500.081ZM342.259,604.5c-60.343,22.5-5.14,197.726,59.153,177.791C448.7,753.276,405.913,599.563,342.259,604.5Zm369,36.687c-29.1,21.163-61.034,43.744-90.138,64.908-0.766,91.506,63.784,86.46,90.138,62.085C710.79,726.322,711.729,683.041,711.26,641.185Z"/>
                        <path id="Shape_321_1" data-name="Shape 321 1" className="secondary-feature" d="M201.063,496.907c47.041,0,66.5,76.523,69.655,90.747,11.458,51.711-.559,82.347-18.438,90.748-28.092,11.8-60.578-29.271-74.776-71.155C160.3,556.488,165.031,496.907,201.063,496.907Zm600.255,83.529c-28.678,19.935-60.465,40.269-89.143,60.2H711.15c-0.287-28.236-1-105.253-1-126.2C738.9,489.61,803.278,486.078,801.318,580.436Zm-454.8,23.718c39.045,0,67.84,61.517,73.751,97.966,8.4,51.827-7,80.2-21.511,84.56-28.463,6.62-61.158-30.212-75.8-78.373C308.172,659.675,315.189,604.154,346.518,604.154Zm365.671,36.489c0.327,42.617-.329,87.949.013,130.569-57.014,38.679-92.96,1.952-92.19-64.967,29.363-21.406,61.3-45.041,91.138-65.605C711.767,640.64,711.727,640.643,712.189,640.643Z"/>
                    </svg>
                }
            </div>
        </div>
    )
}
