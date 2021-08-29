import React, { useState, useEffect } from 'react';
import CommandEditor from './CommandEditor.js';
import './css/EditorCategory.css';

export default function EditorCategory(props) {
  const [editorSections, setEditorSections] = useState([]);
  const [categoryNameState, setCategoryNameState] = useState(props.categoryName + props.categoryPostfix);
  const [toggleNewCommand, setToggleNewCommand] = useState(false);
  let newCommandClass = 'new-command ';


  const deleteCategory = () => {
    if (confirm('You are going to delete this category along with all of the commands under it. Are you sure about this ?')) {
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'category_name': props.categoryName,
        }),
      }

      fetch('/webpage-api/delete-category', requestOptions)
        .then(response => response.json())
        .then(data => {
          alert(data.message);
          props.onChangeCategory();
        });
    }
    return;
  }

  const saveCategoryName = () => {
    if (categoryNameState == '') {
      alert('The field cannot be blank');
      return;
    }
    
    const payload = {
      original_name: props.categoryName,
      new_name: categoryNameState.split(' ')[0],
    }
    const requestOptions = {
      method: '',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }

    if (props.categoryName == '') {
      requestOptions.method = 'POST';
      fetch('/webpage-api/modify-category', requestOptions)
        .then(response => response.json())
        .then(data => {
          alert(data.message);
          setCategoryNameState(payload.new_name + props.categoryPostfix);
          props.onChangeCategory();
        })
      return;
    }
    
    requestOptions.method = 'PATCH';
      fetch('/webpage-api/modify-category', requestOptions)
        .then(response => response.json())
        .then(data => {
          alert(data.message);
        })
  }

  const modifyCommand = () => {
    fetch(`/webpage-api/find-category-commands/${props.categoryID}`)
      .then(response => response.json())
      .then(data => {
        setEditorSections(data.commands);
        setToggleNewCommand(false);
      })
  }

  useEffect(() => {
    if (props.categoryID > 0) {
      fetch(`/webpage-api/find-category-commands/${props.categoryID}`)
        .then(response => response.json())
        .then(data => {
          setEditorSections(data.commands);
        })
    }
  }, [])

  if (toggleNewCommand) {
    newCommandClass += 'toggle ';
  }

  return (
    <div className="editor-category">
      <div className="category-header">
        <div className="header-right">
          <input type="text" value={categoryNameState} onChange={(e) => setCategoryNameState(e.target.value)}></input>
          <button className="icon-button" onClick={saveCategoryName}>
            <span>&#10004;</span>
          </button>
        </div>
        {props.categoryID == 0 ?
          <></> :
          <div className="modify-buttons">
            <button className="icon-button" onClick={() => setToggleNewCommand(current => !current)}>
              <span className="add-symbol">+</span>
            </button>
            {props.new ?
              <></> :
              <button className="icon-button" onClick={deleteCategory}>
                <span className="multiply-symbol">&times;</span>
              </button>
            }
          </div>
        }
      </div>
      <div className={newCommandClass}>
        <CommandEditor
          key={""}
          name={"New Command"}
          function_category={props.categoryID}
          syntax={""}
          description={""}
          userChat={""}
          botChat={""}
          onChangeCommand={modifyCommand}
        />
      </div>
      {editorSections.length > 0 ?
        editorSections.map((obj) => (
          <CommandEditor
            key={obj.syntax}
            name={obj.name}
            function_category={props.categoryID}
            syntax={obj.syntax}
            description={obj.description}
            userChat={obj.userChat}
            botChat={obj.botChat}
            onAdd={modifyCommand}
          />
          )) :
          <></>
      }
    </div>
  )
}
