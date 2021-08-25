import React, { useState, useRef } from 'react';
import './css/EditorBody.css';

export default function CommandBody({description = "",  syntax = "", userChat = "", botChat = "", edit = false, active = false}) {
  const [nameState, setNameState] = useState(syntax);
  const [descriptionState, setDescriptionState] = useState(description);
  const [syntaxState, setSyntaxState] = useState(syntax);
  const [userChatState, setUserChatState] = useState(userChat);
  const [botChatState, setBotChatState] = useState(botChat);
  
  const descBox = useRef(0);
  const modifyCommand = () => {
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: nameState,
        description: descriptionState,
        syntax: syntaxState,
        userChat: userChatState,
        botChat: botChatState,
      }),
    }

    fetch('/webpage-api/modify-command', requestOptions)
    .then(response => response.json())
    .then(data => data);

    return;
  }
  let displayStyle = active? {maxHeight: descBox.current.scrollHeight.toString() + "px"} : {};


  return (
    <div className="editor-body" ref={descBox} style={displayStyle}>
      <article>
        <h3>Name</h3>
        <input type="text" name="name" value={nameState} onChange={(e) => setNameState(e.target.value)}></input>
      </article>
    <article>
      <h3>Function</h3>
        <textarea value={descriptionState} onChange={(e) => setDescriptionState(e.target.value)}></textarea>
    </article>
    <article>
      <h3>Command Line</h3>
        <input type="text" value={syntaxState} onChange={(e) => setSyntaxState(e.target.value)}></input>
    </article>
      <article>
        <div>
          <h3>User</h3>
          <textarea value={userChatState} onChange={e => setUserChatState(e.target.value)}></textarea>
        </div>
        <div>
          <h3>Bot</h3>
          <textarea value={botChatState} onChange={e => setBotChatState(e.target.value)}></textarea>
        </div>
      </article>
      <button onClick={modifyCommand}>Apply Change</button>
    </div>
  )
}