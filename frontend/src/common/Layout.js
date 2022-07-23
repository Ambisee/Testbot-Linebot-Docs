import React from 'react';

import NavBar from './NavBar';
import Footer from './Footer'
import { Outlet } from 'react-router';

export default function Layout(props) {
    const {
        links
    } = props

    return (
        <div>
            <NavBar />
            <Outlet />
            <Footer links={links} />
        </div>
    )
}