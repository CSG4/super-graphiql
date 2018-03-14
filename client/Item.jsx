import React from 'react';

function Item(props) {
    return (
        <div> 
            <li onClick={((e)=>{props.rmTask(props.id)})}>{props.item}</li>
        </div>
    )
}


export default Item;