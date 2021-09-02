import React,{useState, useRef} from 'react'
import {Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './GroupComponent.css'
import AddGroup from './AddGroup';

const GroupComponent = (props)  => {
    const addGroup = props.addGroup
    const [newFlag, setNewFlag] = useState(props.new === true)
    const groupName = useRef(null)

    function addGroupWrapper(){
        addGroup({
            name: groupName.current.value,
            code: '42069XD'
        })
        setNewFlag(false)
    }
    return(
        !newFlag ?
        (<div className = 'group-container'>
            <h4>{props.children.name}</h4>
            <h6>Group Code: {props.children.code}</h6>
        </div>)
        :(
            <div className = 'new-group-container'>
                <input type='text' placeholder = "Enter group name" ref={groupName}/>
                <input type='text' placeholder = "Enter your nickname"/>
                <Button variant = 'success' onClick={addGroupWrapper}>Create</Button>
            </div>
        )
        
    )
}

export default GroupComponent