import React from 'react';
import { Helmet } from 'react-helmet';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import AboutSection from './utils/AboutSection.js';

export default function AboutPage(props) {
    return (
        <>
            <Helmet>
                <title>{props.appTitle ? props.appTitle : ""} | About</title>
            </Helmet>
            <AboutSection />
        </>
    );
};