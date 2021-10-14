import React, { useState, useEffect } from 'react';
import CommandDisplayer from './CommandDisplayer.js';
import './css/CommandCategory.css';

export default function CommandCategory(props) {
  const [displaySections, setDisplaySections] = useState([]);
  const [categoryPostfix, setCategoryPostfix] = useState(" Functions");

  useEffect(() => {
    setDisplaySections(props.categoryFunctions.map((obj) => (
      <CommandDisplayer
        key={obj.name}
        name={obj.name}
        description={obj.description}
        syntax={obj.syntax}
        userChat={obj.userChat}
        botChat={obj.botChat}
      />
      )))}, [])

  return (
    <div className="command-category">
      <h2>{props.categoryName + categoryPostfix}</h2>
      {displaySections}
    </div>
  )
}
