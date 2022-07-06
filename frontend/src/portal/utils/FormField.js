import React, { useReducer } from 'react';

import VisibilityToggler from './VisibilityToggler';
import { reducer, actionCode, initialState } from './_formReducer';
import '../../common/css/IconButton.css';
import './css/FormField.css';

export default function FormField({name, type}) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <div className="form-field">
            <input id={name} name={name} type={state.hidePassword ? type : 'text'} required={true} />
            <label htmlFor={name}>
                {name}
            </label>
            {type == 'password' && <VisibilityToggler dispatch={dispatch} state={state}  />}
        </div>
    )
}

export { actionCode };
