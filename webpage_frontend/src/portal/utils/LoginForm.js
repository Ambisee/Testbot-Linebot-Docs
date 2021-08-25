import React, { useEffect } from 'react';
import InputField from './InputField.js';
import './css/LoginForm.css';

export default function LoginForm(props) {    
    return (
        <form className="login-form" method="POST" action={window.location.origin + '/webpage-api/handle-login'}>
            <InputField name="Username" type="text" />
            <InputField name="Password" type="password" />
            <input type="submit" value="Login"></input>
        </form>
    )
}
