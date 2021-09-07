import React,{useRef} from 'react'
import { Socket } from 'socket.io-client'
import './AddGroup.css'

const AddGroup = (props) => {
    const joinGroup = props.joinGroup

    const groupCodeInput = useRef(null)

    function joinGroupWrapper(){
        joinGroup(groupCodeInput.current.value)
    }
    return(
        <div className = 'add-group-container'>
            <input type= 'text' placeholder = 'Enter group code' className= 'group-code-input' ref={groupCodeInput}/>
            <div className='add-group-button' onClick={joinGroupWrapper}>JOIN</div>
        </div>
    )
}

export default AddGroup