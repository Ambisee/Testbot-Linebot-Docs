import React, { useState, useRef } from 'react';
import MessageEditor from './MessageEditor.js';
import './css/EditorBody.css';

export default function EditorBody({ name = "", function_category = 0, description = "", syntax = "", userChat = "", botChat = "", active = false, callback = () => {} }) {
  const [nameState, setNameState] = useState(name === 'New Command' ? '' : name);
  const [descriptionState, setDescriptionState] = useState(description);
  const [syntaxState, setSyntaxState] = useState(syntax);
  const [userChatState, setUserChatState] = useState(userChat);
  const botChatEditorRef = useRef(0);
  
  const descBox = useRef(0);
  const modifyCommand = () => {
    const requestOptions = {
      method: name != 'New Command' ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original_syntax: syntax,
        name: nameState,
        function_category: function_category,
        description: descriptionState,
        syntax: syntaxState,
        user_chat: userChatState,
        bot_chat: botChatEditorRef.current.value,
      }),
    }

    fetch('/webpage-api/modify-command', requestOptions)
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      if (name == 'New Command') {
        setNameState('');
        setDescriptionState('');
        setSyntaxState('');
        setUserChatState('');
        setBotChatState('');
      }

      callback();
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

    // Send a request to the backend to modify the content of the specified command
    fetch('/webpage-api/modify-command', requestOptions)
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        callback();
      })
    
    return;
  }
  
  let displayStyle = active ? { maxHeight: (descBox.current.scrollHeight + 250).toString() + "px" } : {};

  return (
    <div className="editor-body " ref={descBox} style={displayStyle}>
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
          {/* <textarea value={botChatState} onChange={e => setBotChatState(e.target.value)}></textarea> */}
          <MessageEditor message={botChat} elementRef={botChatEditorRef} />
        </div>
      </article>
      <button type="button" onClick={modifyCommand}>Apply Change</button>
      <button type="button" onClick={deleteCommand}>Delete Command</button>
    </div>
  )
}