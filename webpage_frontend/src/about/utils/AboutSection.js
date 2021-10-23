import React from 'react';
import './css/About.css';

export default function AboutSection(props) {
    return (
        <div className="profile-container">
            <div className="picture">
                <img src="../../static/images/Bot Logo.png" alt="TestBot Logo"></img>
                <span>TestBot</span>
            </div>
            <div className="name">
                <div className="about-section-header">
                    <span>Name</span>
                </div>
                <div className="about-section-description">
                    TestBot
                </div>
            </div>
            <div className="line-id">
                <div className="about-section-header">
                    <span>LINE ID</span>
                </div>
                <div className="about-section-description">
                    @210zohoi
                </div>
            </div>
            <div className="language">
                <div className="about-section-header">
                    <span>Language Used</span>
                </div>
                <div className="about-section-description">
                    Python (3.8.3)
                </div>
            </div>
            <div className="libraries">
                <div className="about-section-header">
                    <span>Libraries</span>
                </div>
                <div className="about-section-description">
                    <ul>
                        <li>Flask (1.1.2)</li>
                        <li>Line-Bot-SDK (1.17.0)</li>
                        <li>Sympy (1.6.2)</li>
                        <li>Requests</li>
                    </ul>
                </div>
            </div>
            <div className="description">
                <div className="about-section-header">
                    <span>Description</span>
                </div>
                <div className="about-section-description">
                    This bot was deployed in December 2020 during the COVID-19 pandemic and was made for 
                    the purpose of entertainment. Since its deployment, new features have been developed
                    and the bot currently provides utilities for mathematics computation and other kinds
                    of reply functions.
                </div>
            </div>
        </div>
    );
}