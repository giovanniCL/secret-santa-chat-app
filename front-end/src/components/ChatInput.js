import React, {useState, useEffect, useRef} from 'react'
import {BsCursor} from 'react-icons/bs'
import './ChatInput.css'

const ChatInput = (props) => {
    const {addChat} = props

    const [mouseHover, setMouseHover] = useState(false)

    const chat_text = useRef(null)

    function sendText(){
        if(!chat_text.current.value) return
        addChat(chat_text.current.value)
        chat_text.current.value = null;

    }
    function toggleHover(){
        setMouseHover(!mouseHover)
    }

    return(
        <div className= "chat-input-container">
            
            <textarea ref={chat_text} />
        <BsCursor className= {mouseHover ?'send-icon-hover' : 'send-icon'} 
            onMouseEnter={toggleHover} 
            onMouseLeave={toggleHover}
            onClick={sendText}
            />
        </div>
    )
}

export default ChatInput