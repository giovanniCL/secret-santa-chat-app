import React,{useState, useRef} from 'react'
import {Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './GroupComponent.css'

const GroupComponent = (props)  => {
    const addGroup = props.addGroup
    const changeSelectedGroup = props.changeSelectedGroup
    const [newFlag, setNewFlag] = useState(props.new === true)
    const groupName = useRef(null)

    function addGroupWrapper(){
        addGroup({
            name: groupName.current.value,
        })
        setNewFlag(false)
    }
    function changeSelectedGroupWrapper(){
        changeSelectedGroup(props.children)
    }
    return(
        !newFlag ?
        (<div className = {props.selected === true ? 'selected-group-container':'group-container'} onClick={changeSelectedGroupWrapper}>
            <h4>{props.children ? props.children.name : ""}</h4>
            <h6>Group Code: {props.children ? props.children.group_code : ""}</h6>
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