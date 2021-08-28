import React, { useEffect, useState } from 'react';
import './css/CommandsContainer.css';
import CommandCategory from './CommandCategory.js';

export default function CommandsContainer(props) {
    const [data, setData] = useState({});
    let commandCategories = [];

    useEffect(() => {
        fetch('http://localhost:8000/webpage-api/get-all-commands')
        .then(response => response.json())
        .then(data => {
            setData(data);
        })
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
                commandCategories.push(<CommandCategory key={key} categoryName={key} categoryFunctions={value} edit={false} />);
            }
        }
    }

    return (
        <div className="commands-container">
            <h1>Currently Available Commands</h1>
            {commandCategories}
        </div>
    );
};
