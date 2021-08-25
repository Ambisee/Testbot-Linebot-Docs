import React from 'react';
import { Helmet } from 'react-helmet';
import NavBar from '../common/NavBar.js';
import Footer from '../common/Footer.js';
import LoginContainer from './utils/LoginContainer.js';

export default function PortalPage(props) {
    return (
        <div>
            <Helmet>
                <title>{props.appTitle ? props.appTitle : ""} | Portal</title>
            </Helmet>
            <NavBar />
            <LoginContainer />
            <Footer links={props.links} />
        </div>
    )
}
