import React from "react";
import { useNavigate } from "react-router";

import FormField from "./FormField.js";
import { useAuth } from '../../_auth/AuthContext';

import "./css/LoginForm.css";

export default function LoginForm() {
    const auth = useAuth();
    const navigator = useNavigate();

    const login = (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = Object.fromEntries(form);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': form.get('csrf_token')
            },
            body: JSON.stringify(data)
        }
        
        fetch('/api/v2/post/auth/login', requestOptions)
            .then(resp => resp.ok ? resp.json() : resp.status)
            .then(data => {
                console.log(data)
                auth.setLoginCredentials(data.username, data.is_admin, data.csrf_token);

                navigator("/dashboard");
                window.location.reload();
            })
    }

    return (
        <form
            className="login-form"
            onSubmit={login}
        >
            <FormField name="username" type="text" />
            <FormField name="password" type="password" />
            {auth.csrfToken && <input type="hidden" name="csrf_token" value={auth.csrfToken} required />}
            <button type="submit">Login</button>
        </form>
    );
}
