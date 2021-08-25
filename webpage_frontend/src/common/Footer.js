import React, { useEffect } from 'react';
import './css/Footer.css';

export default function Footer({links = []}) {
    return (
        <footer>
            <section>
                <h2>About me</h2>
                <div className="profile">
                    <div className="profile-picture"></div>
                    <div className="profile-description">
                        <h3>Ambisee</h3>
                        <p>I code in Python and Javascript</p>
                        <a href="#">Github</a>
                    </div>
                </div>
            </section>
            <section>
                <h2>Navigation</h2>
                <ul className="footer-nav">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Portal</a></li>
                </ul>
            </section>
            <section>
                <h2>Add TestBot</h2>
                <a href="https://lin.ee/PeqBKYB">
                    <img 
                        src="https://scdn.line-apps.com/n/line_add_friends/btn/en.png" 
                        alt="Add Friend" 
                        width="103"
                        height="32"
                    />
                </a>
            </section>
            <section>
                <h2>Other Links</h2>
                <ul className="other-links">
                    {links.map((obj) => {return <li key={obj.name}><a href={obj.link}>{obj.name}</a></li>})}
                </ul>
            </section>
        </footer>
    );
}