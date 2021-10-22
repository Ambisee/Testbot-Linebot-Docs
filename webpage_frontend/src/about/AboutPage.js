import React from 'react';
import { Helmet } from 'react-helmet';
import NavBar from '../common/NavBar';
import Footer from '../common/Footer';
import AboutSection from './utils/AboutSection.js';

export default function AboutPage(props) {
    return (
        <div>
            <Helmet>
                <title>{props.appTitle ? props.appTitle : ""} | About</title>
            </Helmet>
            <NavBar />
            <AboutSection />
            <Footer />
        </div>
    );
};