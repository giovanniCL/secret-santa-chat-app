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
    const [selectedGroup, setSelectedGroup] = useState()
    const [newGroupFlag, setNewGroupFlag] = useState(false)
    const [loginSelected, setLoginSelected] = useState(false)
    const [auth, setAuth] = useState()
    const [user, setUser] = useState()

    useEffect(()=>{
        if(!auth) return
        async function fetchData(){
            let response = await axios.get(`${process.env.REACT_APP_BACKEND}/auth/me`,{
                headers:{
                    'x-access-token': auth
                }
            })
            if(response.data.auth === true) setUser(response.data.user)
        }
        fetchData()
    },[auth])

    useEffect(()=>{
        if(socket) socket.close()
        if(!user) return
        socket = io.connect('http://localhost:8080')
        socket.on('connect', async()=>{
            let socket_id_response = await axios.post(`${process.env.REACT_APP_BACKEND}/auth/socket_id`,{
                socket_id: socket.id
            },{
                headers:{
                    'x-access-token': auth
                }
            })
            
            let groups_response = await axios.get(`${process.env.REACT_APP_BACKEND}/groups/all`,{
                headers: {
                    'x-access-token': auth
                }
            })
            setGroups((prev_groups) => groups_response.data.groups)

        })
        return(()=>socket.close())
    },[user])

    useEffect(()=>{
        if(groups.length === 0) return
        setSelectedGroup((prev_selected)=> groups[0])
        let group_codes = groups.map(group=>group.group_code)
        if(socket) socket.emit('get-groups', group_codes)
    },[groups])

    useEffect(()=>{
        if(!selectedGroup) return
        socket.removeListener('receive-message')
        socket.on('receive-message', (message, group_code)=>{
            if(!selectedGroup) return console.log('no group selected')
            if(group_code === selectedGroup.group_code){
                setChats(prevChats=> [message, ...prevChats])
            } 
        })
    }, [selectedGroup])

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
                        selected={selectedGroup ? group.name === selectedGroup.name : false}
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