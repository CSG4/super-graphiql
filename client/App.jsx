import React from 'react';
import { render } from 'react-dom';
import ToDoList from './ToDoList.jsx';

render((
    <div>
        <ToDoList />
    </div>
), document.getElementById('contents'));