import React, { useState } from 'react';
import CommandHeader from '../../common/CommandHeader.js';
import EditorBody from './EditorBody.js';
import '../../common/css/Command.css';

export default function CommandEditor(props) {
    const [toggle, setToggle] = useState(false);
    
    let sectionClass = "command ";
    if (toggle) {
        sectionClass += "toggled-command ";
    }

    return (
        <section className={sectionClass}>
            <CommandHeader name={props.name} onClick={() => {setToggle(current => !current)}} />
            <EditorBody
                name={props.name}
                function_category={props.function_category}
                description={props.description} 
                syntax={props.syntax}
                userChat={props.userChat}
                botChat={props.botChat}
                callback={() => {
                    setToggle(props.name == 'New Command' ? false : true);  // Minimizes the description if it's for a new command
                    props.callback();                                       // Callback function received from parent component
                }}
                active={toggle}                                             // Bool for minimizing or restoring the description box 
            />
        </section>
    );
}