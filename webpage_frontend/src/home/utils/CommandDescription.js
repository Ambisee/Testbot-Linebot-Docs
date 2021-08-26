import React, { useRef } from 'react';
import './css/CommandDescription.css';

export default function CommandDescription({description = "",  syntax = "", userChat = "", botChat = "", edit = false, active = false}) {
  const descBox = useRef(0);
  const handleLineBreak = (str) => {
    let strArray = str.split('\n');
    let newStr = []
    
    for (let sub of strArray) {
      newStr.push(sub);
      newStr.push(<br/>);
    }
    
    newStr.pop();
    return newStr
  }

  let displayStyle = active? {maxHeight: descBox.current.scrollHeight.toString() + "px"} : {};

  return (
    <div className="command-description" ref={descBox} style={displayStyle}>
      <article>
        <h3>Function</h3>
        <p>{handleLineBreak(description)}</p>
      </article>
      <article>
        <h3>Command Line</h3>
        <pre><code>{syntax}</code></pre>
      </article>
      <article>
        <h3>Demonstration</h3>
        <div className="chat-box">
          <span>User</span>
            <div className="chat">
              <img src="../../static/images/Bot Logo.png" alt="user.png" />
              <span>User</span>
              <p>{handleLineBreak(userChat)}</p>
            </div>
        </div>
        <div className="chat-box">
          <span>TestBot</span>
            <div className="chat">
                <img src="../../static/images/Bot Logo.png" alt="bot.png" />
                <span>Bot</span>
                <p>{handleLineBreak(botChat)}</p>
            </div>
        </div>
      </article>
    </div>
  )
}