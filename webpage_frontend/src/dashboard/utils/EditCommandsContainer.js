import React, { useEffect, useState } from 'react';
import EditorCategory from './EditorCategory.js';
import './css/EditCommandsContainer.css';

export default function EditCommandsContainer(props) {
  const [data, setData] = useState({});
  const [toggleNewCategory, setToggleNewCategory] = useState(false);
  let commandCategories = [];
  let newCategoryClass = "new-category ";

  useEffect(() => {
    fetch('http://localhost:8000/webpage-api/display-commands')
      .then(response => response.json())
      .then(data => setData(data)) // Object(key:string, value:Array(Object))
  }, [])

  if (toggleNewCategory) {
    newCategoryClass += "toggle";
  }

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
      commandCategories.push(
        <EditorCategory
          key={key}
          categoryName={key}
          categoryFunctions={value}
          commandPostfix=" Functions"
          new={['Help', 'Miscellaneous'].includes(key) ? true : false}
        />
      );
    }
  }

  return (
    <div className="commands-container">
      <div className="editor-header">
        <h1>Edit Commands</h1>
        <div>
          <button onClick={() => {setToggleNewCategory(current => !current)}}>
            <span></span>
            <span>Add Category</span>
          </button>
        </div>
      </div>
      <div className={newCategoryClass}>
        <EditorCategory categoryName="" commandPostfix="" new={true} />
      </div>
      {commandCategories}
    </div>
  )
}