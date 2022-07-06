import React from 'react';
import Footer from '../common/Footer.js';
import NavBar from '../common/NavBar.js';
import HeroContainer from './utils/HeroContainer.js';
import CommandsContainer from './utils/CommandsContainer.js';
import { Helmet } from 'react-helmet';

export default function HomePage(props) {
    return (
        <div>
            <Helmet>
                <title>{props.appTitle ? props.appTitle : ""} | Home</title>
            </Helmet>
            <NavBar />
            <HeroContainer />
            <CommandsContainer />
            <Footer links={props.links}/>
        </div>
    );
}