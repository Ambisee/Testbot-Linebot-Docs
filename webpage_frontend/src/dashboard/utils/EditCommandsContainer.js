import React, { useEffect, useState } from 'react';
import EditorCategory from './EditorCategory.js';
import Loading from './Loading.js';
import './css/EditCommandsContainer.css';

export default function EditCommandsContainer() {
  const [data, setData] = useState([]);
  const [toggleNewCategory, setToggleNewCategory] = useState(false);
  let newCategoryClass = "new-category ";

  const renderCategories = () => {
    if (data.length > 0) {
      let commandCategories = data;
      let misc = commandCategories.findIndex(e => (e.id == 2));

      [commandCategories[misc], commandCategories[commandCategories.length - 1]] =
        [commandCategories[commandCategories.length - 1], commandCategories[misc]];

      return commandCategories.map(obj => (
        <EditorCategory
          key={obj.id}
          categoryID={obj.id}
          categoryName={obj.name}
          categoryPostfix=" Functions"
          callback={refreshCategories}
          deletable={[1, 2].includes(obj.id) ? false : true}
        />
      ))
    }
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const refreshCategories = () => {
    fetch('/webpage-api/get-all-categories')
      .then(response => response.json())
      .then(data => {
        setData(data.categories) // Array(Object(id: Number, name: String))
        setToggleNewCategory(false);
      })
  }

  useEffect(() => {
    fetch('/webpage-api/get-all-categories')
      .then(response => response.json())
      .then(data => {
        setData(data.categories) // Array(Object(id: Number, name: String))
      })
  }, [])

  if (toggleNewCategory) {
    newCategoryClass += "toggle";
  }

  return (
    <div className="commands-container">
      <div className="container-header">
        <h1>Edit Commands</h1>
        <div>
          <button onClick={() => {setToggleNewCategory(current => !current)}}>
            <span></span>
            <span>Add Category</span>
          </button>
        </div>
      </div>
      <div className={newCategoryClass}>
        <EditorCategory key={0} categoryID={0} categoryName="" categoryPostfix="" deletable={false} rerenderCallback={refreshCategories} />
      </div>
      {renderCategories()}
    </div>
  )
}