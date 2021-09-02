import React,{useState} from 'react'
import ChatInput from './ChatInput'
import ChatComponent from './ChatComponent'
import GroupComponent from './GroupComponent'
import AddGroup from './AddGroup'
import {Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'

const Main = (props) =>{

    const [chats, setChats] = useState(["Hello World this is my first chat"])
    const [groups, setGroups] = useState([{
        name: 'Dummy Group',
        code: '123456'
    }])
    const [newGroupFlag, setNewGroupFlag] = useState(false)

    function addChat(chat){
        let newChats = [chat,...chats]
        setChats(newChats)
    }

    function addGroup(group){
        let newGroups = [...groups, group]
        setGroups(newGroups)
        setNewGroupFlag(false)
    }


    return(
        <div className= "main-content">
            <div className = 'chat-container'>
                <div className = 'chat-contents'>
                    {chats.map((chat, id) =>(
                        <ChatComponent key ={id}>{chat}</ChatComponent>
                    ))}
                </div>
                <ChatInput addChat={addChat}/>
            </div>
            <div className = 'menu-container'>
                <div className = 'menu-contents'>
                    {groups.map((group, id) => (
                        <GroupComponent key={id} new={false} addGroup={addGroup}>{group}</GroupComponent>
                    ))}
                    {newGroupFlag ? <GroupComponent new={true} addGroup={addGroup} /> : ''}
                </div>
                <div className = 'menu-input-container'>
                    <AddGroup />
                    <div className='new-group-button-container'>
                        <Button variant = "warning" onClick = {()=>setNewGroupFlag(true)}> New Group</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main