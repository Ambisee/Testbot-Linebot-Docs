import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.js';
import { AuthContextProvider } from './_auth/AuthContext.js';

const root = document.getElementById('root');

ReactDOM.render(
    <App />, 
    root
);