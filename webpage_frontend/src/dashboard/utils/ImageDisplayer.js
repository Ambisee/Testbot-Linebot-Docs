import React, { useState } from 'react';
import './css/ImageDisplayer.css';

export default function ImageDisplayer({ name="", src=null, onDelete=() => {}}) {
    const deleteImage = () => {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                deletionTarget: name
            })
        }

        fetch('/dropbox-api/delete-image', requestOptions)
            .then(response => response.json())
            .then(data => {
                onDelete(name);
            });
    }
    
    return (
        <div className="image-displayer">
            <img src={src != null ? src : "#"}></img>
            <div className="image-control">
                <a href={src} target="_blank" className="icon-button">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
                            <path id="Magnifying_Glass_1" data-name="Magnifying Glass  1" className="magnifying-glass" d="M197.146,178.708a13.038,13.038,0,0,1-18.438,18.438l-79.9-79.9a12.983,12.983,0,0,1-3.751-7.915,60.255,60.255,0,1,1,14.274-14.274,12.983,12.983,0,0,1,7.915,3.751Zm-136.3-157.6a39.735,39.735,0,1,0,39.735,39.734A39.734,39.734,0,0,0,60.843,21.109Z"/>
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
        </div>
    )
}
