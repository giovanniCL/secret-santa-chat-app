require('dotenv').config()
const express = require('express')
const http = require('http')
const socket_io = require('socket.io')
const db = require('./db')
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
const axios = require('axios')

const auth = require('./routes/Auth')
const User = require('./schemas/User')
const Group = require('./schemas/Group')

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

    socket.on('message', async (message, group_code, callback)=>{
        console.log(message)
        console.log(group_code)
        socket.broadcast.to(group_code).emit('receive-message',message, group_code)
        callback(message, group_code)
    })

    socket.on('new-room', async (group, callback)=>{
        let user = await User.findOne({socket_id: socket.id})
        if (!user) return
        let new_group = new Group({
            name: group.name,
            group_code: uuidv4(),
            members: [user._id]
        })
        await new_group.save()
        socket.join(new_group.group_code)
        callback(new_group)
    })

    socket.on('join-room', async (group_code, callback)=>{
        let group = await Group.findOne({group_code: group_code})
        let user = await User.findOne({socke_id: socket.id})
        if(group && user){
            console.log(group)
            group.members = [...group.members, user._id]
            await group.save()
            socket.join(group_code)
            callback(group)
        }
    })
})


const PORT = process.env.PORT || 8080
server.listen(PORT, ()=> console.log(`listening on port ${PORT}`))