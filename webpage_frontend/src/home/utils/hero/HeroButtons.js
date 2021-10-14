import React from 'react';
import '../css/HeroButtons.css';

export default function HeroButtons(props) {
    const scrollToCommandsList = () => {
        const listHeader = document.querySelector('.commands-container > h1');
        window.scrollTo({top: listHeader.offsetTop, left: 0, behavior: 'smooth'});
    }
    
    return (
        <div id="hero-buttons">
            <a href="https://lin.ee/PeqBKYB">Add TestBot as friend</a>
            <button onClick={scrollToCommandsList}>See list of commands</button>
        </div>
    );
}
