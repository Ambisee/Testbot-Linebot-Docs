import React, { useEffect, useState } from 'react';
import EditorCategory from './EditorCategory.js';
import './css/EditCommandsContainer.css';

export default function EditCommandsContainer(props) {
  const [data, setData] = useState({});
  let commandCategories = [];

  useEffect(() => {
    fetch('http://localhost:8000/webpage-api/display-commands')
    .then(response => response.json())
    .then(data => setData(data)) // Object(key:string, value:Array(Object))
  }, [])

  if (data) {
    let objectList = Object.entries(data);
    let misc = objectList.findIndex(element => element[0] == 'Miscellaneous');
  
    [
      objectList[objectList.length - 1], 
      objectList[misc]
    ] = [
      objectList[misc], 
      objectList[objectList.length - 1]
    ];
  
    for (const [key, value] of objectList) {
      if (value.length > 0) {
        commandCategories.push(<EditorCategory key={key} categoryName={key} categoryFunctions={value} edit={true} />);
      }
    }
  }

  return (
    <div className="commands-container">
      <div className="editor-header">
        <h1>Edit Commands</h1>
        <div>
          <button>
            <span></span>
            <span>Add Category</span>
          </button>
        </div>
      </div>
      {commandCategories}
    </div>
  )
}
