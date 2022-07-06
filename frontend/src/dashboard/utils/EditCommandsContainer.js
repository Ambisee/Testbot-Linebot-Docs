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

      return commandCategories.map(obj => (
        <EditorCategory
          key={obj.id}
          categoryID={obj.id}
          categoryName={obj.category_name}
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
    fetch('/webpage-api/all-categories')
      .then(response => response.json())
      .then(data => {
        setData(data.categories) // Array(Object(id: Number, category_name: String))
        setToggleNewCategory(false);
      })
  }

  useEffect(() => {
    fetch('/webpage-api/all-categories')
      .then(response => response.json())
      .then(data => {
        setData(data.categories) // Array(Object(id: Number, category_name: String))
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