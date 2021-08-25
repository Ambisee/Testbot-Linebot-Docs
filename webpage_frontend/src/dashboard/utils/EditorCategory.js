import React, { useState, useEffect } from 'react';
import CommandEditor from './CommandEditor.js';
import './css/EditorCategory.css';

export default function CommandCategory(props) {
  const [displaySections, setDisplaySections] = useState([]);
  const [categoryName, setCategoryName] = useState(props.categoryName + " Functions")

  const deleteCategory = () => {
    if (!confirm('You are going to delete this category along with all of the commands under it. Are you sure about this ?')) {
      return;
    }

    requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        "name": props.categoryName,
      }
    }

    fetch('/webpage-api/delete-category', requestOptions)
    .then(response => response.json())
    .then(data => data);

    return;
  }

  useEffect(() => {
    setDisplaySections(props.categoryFunctions ? props.categoryFunctions.map((obj) => (
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
        <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}></input>
        {/* {
          () => {
            let x = props.categoryName.toLowerCase();
            return x == 'Miscellaneous' ||x == 'Help' ?
              <></> : */}
          <button className="x-button" onClick={deleteCategory}>
            <span className="multiply-symbol">&times;</span>
          </button>
          {/* }
        }  */}
      </div>
      {displaySections}
    </div>
  )
}
