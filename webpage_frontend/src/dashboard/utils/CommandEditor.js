import React, { useState } from 'react';
import EditorHeader from './EditorHeader.js';
import EditorBody from './EditorBody';
import './css/CommandEditor.css';

export default function Command(props) {
    const [toggle, setToggle] = useState(false);
    
    let sectionClass = "command ";
    if (toggle) {
        sectionClass += "toggled-command ";
    }

    return (
        <section className={sectionClass}>
            <EditorHeader name={props.name} onClick={() => {setToggle(current => !current)}} />
            <EditorBody
                name={props.name}
                function_category={props.function_category}
                description={props.description} 
                syntax={props.syntax}
                userChat={props.userChat}
                botChat={props.botChat}
                edit={props.edit}
                rerender={props.rerender}
                active={toggle} 
            />
        </section>
    );
}