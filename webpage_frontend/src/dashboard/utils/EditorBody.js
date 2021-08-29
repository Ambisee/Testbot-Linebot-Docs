import React, { useState, useRef } from 'react';
import './css/EditorBody.css';

export default function CommandBody({ name="", function_category=0, description="", syntax="", userChat="", botChat="", active=false, onChangeCommand=() => {}}) {
  const [nameState, setNameState] = useState(name);
  const [descriptionState, setDescriptionState] = useState(description);
  const [syntaxState, setSyntaxState] = useState(syntax);
  const [userChatState, setUserChatState] = useState(userChat);
  const [botChatState, setBotChatState] = useState(botChat);
  
  const descBox = useRef(0);
  const modifyCommand = () => {
    const requestOptions = {
      method: name ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original_syntax: syntax,
        name: nameState,
        function_category: name ? 0 : function_category,
        description: descriptionState,
        syntax: syntaxState,
        user_chat: userChatState,
        bot_chat: botChatState,
      }),
    }

    fetch('/webpage-api/modify-command', requestOptions)
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      onChangeCommand();
    });

    return;
  }

  const deleteCommand = () => {
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name
      })
    }

    fetch('/webpage-api/modify-command', requestOptions)
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        onChangeCommand();
      })
    
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
      <button type="button" onClick={modifyCommand}>Apply Change</button>
      <button type="button" onClick={deleteCommand}>Delete Command</button>
    </div>
  )
}