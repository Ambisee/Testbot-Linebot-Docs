import React, { useState, useEffect } from 'react';
import CommandEditor from './CommandEditor.js';
import './css/EditorCategory.css';

export default function EditorCategory(props) {
  const [editorSections, setEditorSections] = useState([]);
  const [categoryName, setCategoryName] = useState(props.categoryName + props.commandPostfix)

  const deleteCategory = () => {
    if (confirm('You are going to delete this category along with all of the commands under it. Are you sure about this ?')) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "category_name": props.categoryName,
        }),
      }

      fetch('/webpage-api/delete-category', requestOptions)
        .then(response => response.json())
        .then(data => data);
    }
    return;
  }

  const saveCategoryName = () => {
    if (categoryName == '') {
      alert('The field cannot be blank');
      return;
    }
    
    if (props.categoryName == '') {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_name: categoryName.split(' ')[0],
        })
      }

      fetch('/webpage-api/modify-category', requestOptions)
        .then(response => response.json())
        .then(data => data)
    }
  
  }

  useEffect(() => {
    setEditorSections(props.categoryFunctions ? props.categoryFunctions.map((obj) => (
        <CommandEditor 
          key={obj.name}
          name={obj.name}
          description={obj.description}
          syntax={obj.syntax}
          userChat={obj.userChat}
          botChat={obj.botChat}
          edit={props.edit}
        />
    )) :
    [])
  }, [])

  return (
    <div className="editor-category">
      <div className="category-header">
        <div className="header-right">
          <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}></input>
          <button className="icon-button" onClick={saveCategoryName}>
            <span>&#10004;</span>
          </button>
        </div>
        {props.categoryName == '' ?
          <></> :
          <div className="modify-buttons">
            <button className="icon-button" onClick={() => { }}>
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
      {editorSections}
    </div>
  )
}
