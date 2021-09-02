import React from 'react'
import './AddGroup.css'

const AddGroup = (props) => {

    return(
        <div className = 'add-group-container'>
            <input type= 'text' placeholder = 'Enter group code' className= 'group-code-input'/>
            <div className='add-group-button'>JOIN</div>
        </div>
    )
}

export default AddGroup