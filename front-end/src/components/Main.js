import React,{useState} from 'react'
import ChatInput from './ChatInput'
import ChatComponent from './ChatComponent'
import './Main.css'

const Main = (props) =>{

    const [chats, setChats] = useState(["Hello World this is my first chat", "GAAAAAA"])

    function addChat(chat){
        let newChats = [chat,...chats]
        setChats(newChats)
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
            </div>
        </div>
    )
}

export default Main