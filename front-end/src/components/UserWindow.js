import React,{useState, useRef} from 'react'
import {Button} from 'react-bootstrap'
import './UserWindow.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const UserWindow = (props) =>{
    const user = props.user
    const handleLogin = props.handleLogin
    const handleLogout = props.handleLogout
    const handleSignup = props.handleSignup

    const [errorMessage, setErrorMessage] = useState('')
    const username_input = useRef(null)
    const password_input = useRef(null)


    async function handleLoginWrapper(){
        let user_to_login = {
            username: username_input.current.value,
            password: password_input.current.value
        }
        let response = await handleLogin(user_to_login)
        if(response.auth === false){
            setErrorMessage(response.message)
        }
    }

    async function handleSignupWrapper(){
        let user_to_signup = {
            username: username_input.current.value,
            password: password_input.current.value
        }
        console.log(user_to_signup)
        let response = await handleSignup(user_to_signup)
        if(response.auth === false){
            setErrorMessage(response.message)
        }
    }
    return(
        <div className = 'user-window'>
            {!user ?(
            <form className = 'login-form'>
                <input type = 'text' placeholder = 'username' ref={username_input}/>
                <input type = 'text' placeholder = 'password' ref={password_input} />
                <Button  variant = 'success' onClick = {handleLoginWrapper}> Login </Button>
                <Button variant = 'warning' onClick={handleSignupWrapper}> Sign Up </Button>
                <p className='user-window-error-message'>{errorMessage}</p>
            </form>
            )
            :
            <div className = 'settings-container'>
                <p>{user.username}</p>
                <Button variant = 'danger' onClick={handleLogout}> Logout</Button>

            </div>
            }
        </div>
    )
}

export default UserWindow