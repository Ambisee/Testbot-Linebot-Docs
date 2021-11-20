import React, { useEffect } from 'react';
import FormField from './FormField.js';
import './css/LoginForm.css';

export default function LoginForm(props) {    
    return (
        <form className="login-form" method="POST" action={window.location.origin + '/webpage-api/handle-login'}>
            <FormField name="Username" type="text" />
            <FormField name="Password" type="password" />
            <input type="submit" value="Login"></input>
        </form>
    )
}
