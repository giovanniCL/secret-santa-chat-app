require('dotenv').config()
const express = require('express')
const http = require('http')
const socket_io = require('socket.io')
const db = require('./db')
const cors = require('cors')

const auth = require('./routes/Auth')
const User = require('./schemas/User')

const app = express()
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use('/auth',auth)
const server = http.createServer(app)
const io = socket_io(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const rooms = []

io.on('connection', socket=>{
    console.log('New Web Socket Connection...')
    // let new_user = new User({
    //     username: 'pepe',
    //     password: 'password',
    //     groups : [],
    //     socket_id: '1234'
    // })
    // new_user.save().then(()=>console.log('new user saved'))
    socket.on('message', async (message, group_code, callback)=>{
        console.log(message)
        console.log(group_code)
        socket.broadcast.to(group_code).emit('receive-message',message)
        callback(message)
    })

    socket.on('new-room', (group, callback)=>{
        socket.join(group.code)
        rooms.push(group)
        console.log(rooms)
        callback(group)
    })

    socket.on('join-room',(group_code, callback)=>{
        let group = rooms.filter(room=>room.code === group_code)[0]
        if(group){
            console.log(group)
            socket.join(group_code)
            callback(group)
        }
    })
})


const PORT = process.env.PORT || 8080
server.listen(PORT, ()=> console.log(`listening on port ${PORT}`))