import React, { useState, useEffect } from 'react';
import CommandEditor from './CommandEditor.js';
import './css/EditorCategory.css';

export default function EditorCategory(props) {
  const [editorSections, setEditorSections] = useState([]);
  const [categoryNameState, setCategoryNameState] = useState(props.categoryName + props.commandPostfix);
  const [toggleNewCommand, setToggleNewCommand] = useState(false);
  let newCommandClass = "new-command ";


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
        .then(data => {
          alert(data.message);
        });
    }
    return;
  }

  const saveCategoryName = () => {
    if (categoryNameState == '') {
      alert('The field cannot be blank');
      return;
    }
    
    const requestOptions = {
      method: '',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original_name: props.categoryName,
        category_name: categoryNameState.split(' ')[0],
      })
    }

    if (props.categoryName == '') {
      requestOptions.method = 'POST';
      fetch('/webpage-api/modify-category', requestOptions)
        .then(response => response.json())
        .then(data => {
          alert(data.message);
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

  const rerender = () => {
    fetch(`/webpage-api/find-category-commands/${categoryNameState.split(' ')[0]}`)
      .then(response => response.json())
      .then(data => {
        setEditorSections(data.data);
        setToggleNewCommand(false);
      })
  }

  useEffect(() => {
    setEditorSections(props.categoryFunctions ? props.categoryFunctions : []);
    console.log('categoryFunc ; ', props.categoryFunctions)
    console.log('editorSec :', editorSections)
  }, [])

  if (toggleNewCommand) {
    newCommandClass += "toggle ";
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
        {props.categoryName == '' ?
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
          name={""}
          function_category={props.categoryFunctions ? props.categoryFunctions[0].function_category : 0}
          syntax={""}
          description={""}
          userChat={""}
          botChat={""}
          rerender={rerender}
        />
      </div>
      {editorSections.length > 0 ?
        editorSections.map((obj) => (
          <CommandEditor
            key={obj.syntax}
            name={obj.name}
            function_category={obj.function_category}
            syntax={obj.syntax}
            description={obj.description}
            userChat={obj.userChat}
            botChat={obj.botChat}
            rerender={rerender}
          />
          )) :
          <></>
      }
    </div>
  )
}
