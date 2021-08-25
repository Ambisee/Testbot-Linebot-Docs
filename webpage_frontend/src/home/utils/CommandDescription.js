import React, { useState, useRef } from 'react';
import './css/CommandDescription.css';

export default function CommandBody({description = "",  syntax = "", userChat = "", botChat = "", edit = false, active = false}) {
  const [nameState, setNameState] = useState(syntax);
  const [descriptionState, setDescriptionState] = useState(description);
  const [syntaxState, setSyntaxState] = useState(syntax);
  const [userChatState, setUserChatState] = useState(userChat);
  const [botChatState, setBotChatState] = useState(botChat);
  const descBox = useRef(0);
  let displayStyle = active? {maxHeight: descBox.current.scrollHeight.toString() + "px"} : {};

  return (
    <div className="command-description" ref={descBox} style={displayStyle}>
      <article>
        <h3>Function</h3>
        <p>{description}</p>
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
              <p>{userChat}</p>
            </div>
        </div>
        <div className="chat-box">
          <span>TestBot</span>
            <div className="chat">
                <img src="../../static/images/Bot Logo.png" alt="bot.png" />
                <span>Bot</span>
                <p>{botChat}</p>
            </div>
        </div>
      </article>
    </div>
  )
}