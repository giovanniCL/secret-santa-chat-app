import React from 'react'
import './ChatComponent.css'

const ChatComponent = (props) => {
    return(
        <div className = 'chat-component'>
            <img className = 'chat-image-container' src = "https://i.natgeofe.com/n/3861de2a-04e6-45fd-aec8-02e7809f9d4e/02-cat-training-NationalGeographic_1484324.jpg" />
                
            <div className= 'chat-text-container'>
                {props.children}
            </div>
        </div>
    )
}

export default ChatComponent