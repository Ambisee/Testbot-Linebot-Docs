import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Footer from '../common/Footer.js';
import DashboardNavBar from './utils/DashboardNavBar.js';
import EditCommandsContainer from './utils/EditCommandsContainer.js';
import EditImagesContainer from './utils/EditImagesContainer.js';

export default function DashboardPage(props) {
    return (
        <div>
            <Helmet>
                <title>{props.appTitle ? props.appTitle : ""} | Editor Dashboard</title>
            </Helmet>
            <DashboardNavBar />
            <div style={{ height: 'var(--navbar-height)' }}></div>
            <EditImagesContainer />
            <EditCommandsContainer />
            <Footer />
        </div>
    )
}