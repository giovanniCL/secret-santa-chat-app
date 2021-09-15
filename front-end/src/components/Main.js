import React,{useState, useEffect} from 'react'
import axios from 'axios'
import ChatInput from './ChatInput'
import ChatComponent from './ChatComponent'
import GroupComponent from './GroupComponent'
import AddGroup from './AddGroup'
import UserWindow from './UserWindow'
import {Button} from 'react-bootstrap'
import io from 'socket.io-client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Main.css'
require('dotenv').config()

let socket

const Main = (props) =>{

    const [chats, setChats] = useState([])
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState({})
    const [newGroupFlag, setNewGroupFlag] = useState(false)
    const [loginSelected, setLoginSelected] = useState(false)
    const [auth, setAuth] = useState()
    const [user, setUser] = useState()

    useEffect(async ()=>{
        if(!user) return
        if(socket) socket.close()
        socket = io.connect('http://localhost:8080')
        socket.on('connect', async()=>{
            let response = await axios.post(`${process.env.REACT_APP_BACKEND}/auth/socket_id`,{
                socket_id: socket.id
            },{
                headers:{
                    'x-access-token': auth
                }
            })
            console.log(response.data)
        })
        socket.on('receive-message', (message, group_code)=>{
            if(group_code === selectedGroup.group_code) setChats(prevChats=> [message, ...prevChats])
        })
        return(()=>socket.close())
    },[user])

    useEffect(async ()=>{
        if(!auth) return
        let response = await axios.get(`${process.env.REACT_APP_BACKEND}/auth/me`,{
            headers:{
                'x-access-token': auth
            }
        })
        if(response.data.auth === true) setUser(response.data.user)
    },[auth])

    /*
    useEffect(()=>{
        console.log("GROUPS: ")
        groups.forEach(group=>console.log(group))
    },[groups])
    */

    function addChat(chat){
        socket.emit('message', chat, selectedGroup.group_code,()=>{
            let newChats = [chat,...chats]
            setChats(newChats)
        })
    }

    function addGroup(group){
        socket.emit('new-room',group,addGroupCallback)
    }

    function changeSelectedGroup(group){
        setSelectedGroup(group)
    }

    function joinGroup(group_code){
        socket.emit('join-room', group_code, addGroupCallback)
    }

    function addGroupCallback(group){
        let newGroups = [...groups, group]
        setGroups(newGroups)
        setNewGroupFlag(false)
        setSelectedGroup(group)
    }

    async function handleLogin(user){
        let response = await axios.post(`${process.env.REACT_APP_BACKEND}/auth/login`,{
            username: user.username,
            password: user.password
        })
        setAuth(response.data.token)
        return response.data
    }
    function handleLogout(){
        setUser(null)
        setAuth(false)
    }

    async function handleSignup(user){
        let response = await axios.post(`${process.env.REACT_APP_BACKEND}/auth/signup`,{
            username: user.username,
            password: user.password
        })
        setAuth(response.data.token)
        return response.data
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
                <div className = 'menu-header'>
                    <Button variant = {auth ? 'warning':'success'} 
                    onClick = {()=>setLoginSelected(prev => !prev)}>{auth ? 'Settings' : 'Login'}</Button>
                    {(loginSelected ? <UserWindow user={user} 
                    handleLogin={handleLogin} handleLogout={handleLogout} 
                    handleSignup={handleSignup} /> : '')}

                </div>
                <div className = 'menu-contents'>
                    {groups.map((group, id) => (
                        <GroupComponent key={id} new={false} 
                        selected={group.name === selectedGroup.name}
                        changeSelectedGroup={changeSelectedGroup} 
                        addGroup={addGroup}>{group}</GroupComponent>
                    ))}
                    {newGroupFlag ? <GroupComponent new={true} addGroup={addGroup} /> : ''}
                </div>
                <div className = 'menu-input-container'>
                    <AddGroup joinGroup={joinGroup} />
                    <div className='new-group-button-container'>
                        <Button variant = "warning" onClick = {()=>setNewGroupFlag(true)}> New Group</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main