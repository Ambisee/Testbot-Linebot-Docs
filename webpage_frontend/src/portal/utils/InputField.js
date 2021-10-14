import React, { useEffect } from 'react';
import './css/InputField.css';
import '../../common/css/IconButton.css';

export default function InputField(props) {
    const clearInput = () => {
        if (props.type != 'text' && props.type != 'password') return;

        const target = document.querySelector(`.input-field > input[id=${props.name.toLowerCase()}]`);
        target.value = "";
        return;
    }

    return (
        <div className="input-field">
            <input id={props.name.toLowerCase()} name={props.name.toLowerCase()} type={props.type} required={true}></input>
            <label htmlFor={props.name.toLowerCase()}>
                <span>{props.name}</span>
            </label>
            <button className="icon-button" onClick={clearInput} type="button">
                <div className="cross-line-1"></div>
                <div className="cross-line-2"></div>
            </button>
        </div>
    )
}
