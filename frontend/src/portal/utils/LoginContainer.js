import React from 'react'
import LoginForm from './LoginForm.js'
import './css/LoginContainer.css';

export default function LoginContainer(props) {
    return (
        <div className="login-container">
            <h1>User Login</h1>
            <LoginForm />
        </div>
    )
}
