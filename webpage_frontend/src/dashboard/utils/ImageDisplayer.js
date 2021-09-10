import React, { useState } from 'react';
import './css/ImageDisplayer.css';

export default function ImageDisplayer({ name="", file_ext="", src=null, onDelete=() => {}}) {
    const [deleting, setDeleting] = useState(false)

    const deleteImage = (name) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deletion_target: `${name.split(' ').join('_')}.${file_ext}`,
            })
        }

        setDeleting(true);
        fetch('/dropbox-api/delete-image', requestOptions)
            .then(response => {
                setDeleting(false);
                if (response.ok) return response.json();
                return response.status;
            })
            .then(data => {
                if (!(isFinite(data))) {
                    alert(data.message);
                    onDelete();
                    return;
                }
                alert('Error')
                return;
            });
    }
    
    return (
        <div className="image-displayer">
            <img src={src != null ? src : "#"}></img>
            {deleting ?
                <div className="image-control" id="deleting">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="132.5 0 735 1000">
                        <path id="Bot_Logo_1" data-name="Bot Logo 1" className="primary-feature" d="M861.958,251.738C709.317,144.606,474.007-20.047,505.634,1.983,385.932,88.048,263.377,174.139,143.676,260.2,261.5,343.447,382.176,426.715,500,509.958,532.064,486.7,861.691,253.9,861.958,251.738ZM131,282.78L487.324,532.535c-0.469,155.669.265,312.388,0,468.465-1.147-1.355-3.286-3.293-4.225-4.233L131,749.835V282.78ZM511.267,999.589V533.946C628.622,451.643,749.7,366.792,869,282.78c0,19.487.018,92.21,0,111.473V748.424C751.176,830.726,541.881,978.1,511.267,999.589ZM194.378,498.67c-61.81,23.6-2.548,201.653,60.561,176.38C300.384,638.537,251.959,490.763,194.378,498.67Zm547.866,1.411c-11.116,5.533-23.057,7.039-30.984,15.521,0,41.857-.11,83.181-0.11,125.038,29.573-20.693,59.6-39.88,89.175-60.573,0.489-20.433-3.774-43.206-11.6-57.41C779.883,506.623,765.793,499.483,742.244,500.081ZM342.259,604.5c-60.343,22.5-5.14,197.726,59.153,177.791C448.7,753.276,405.913,599.563,342.259,604.5Zm369,36.687c-29.1,21.163-61.034,43.744-90.138,64.908-0.766,91.506,63.784,86.46,90.138,62.085C710.79,726.322,711.729,683.041,711.26,641.185Z" />
                        <path id="Shape_321_1" data-name="Shape 321 1" className="secondary-feature" d="M201.063,496.907c47.041,0,66.5,76.523,69.655,90.747,11.458,51.711-.559,82.347-18.438,90.748-28.092,11.8-60.578-29.271-74.776-71.155C160.3,556.488,165.031,496.907,201.063,496.907Zm600.255,83.529c-28.678,19.935-60.465,40.269-89.143,60.2H711.15c-0.287-28.236-1-105.253-1-126.2C738.9,489.61,803.278,486.078,801.318,580.436Zm-454.8,23.718c39.045,0,67.84,61.517,73.751,97.966,8.4,51.827-7,80.2-21.511,84.56-28.463,6.62-61.158-30.212-75.8-78.373C308.172,659.675,315.189,604.154,346.518,604.154Zm365.671,36.489c0.327,42.617-.329,87.949.013,130.569-57.014,38.679-92.96,1.952-92.19-64.967,29.363-21.406,61.3-45.041,91.138-65.605C711.767,640.64,711.727,640.643,712.189,640.643Z" />
                    </svg>
                </div> :
                <div className="image-control">
                    <a href={src} target="_blank" className="icon-button">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                                <path id="Magnifying_Glass_1" data-name="Magnifying Glass  1" className="magnifying-glass" d="M197.146,178.708a13.038,13.038,0,0,1-18.438,18.438l-79.9-79.9a12.983,12.983,0,0,1-3.751-7.915,60.255,60.255,0,1,1,14.274-14.274,12.983,12.983,0,0,1,7.915,3.751Zm-136.3-157.6a39.735,39.735,0,1,0,39.735,39.734A39.734,39.734,0,0,0,60.843,21.109Z" />
                            </svg>
                        </span>
                    </a>
                    <button className="icon-button" onClick={() => deleteImage(name)}>
                        <span>&times;</span>
                    </button>
                    <span className="display-name">
                        {`--${name}`}
                    </span>
                </div>
            }
        </div>
    )
}
