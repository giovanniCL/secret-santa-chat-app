require('dotenv').config()
const express = require('express')
const http = require('http')
const socket_io = require('socket.io')
const db = require('./db')
const cors = require('cors')
const {v4: uuidv4} = require('uuid')
const axios = require('axios')

const auth = require('./routes/Auth')
const group_controller = require('./routes/GroupController')
const User = require('./schemas/User')
const Group = require('./schemas/Group')

const app = express()
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use('/auth',auth)
app.use('/groups', group_controller)
const server = http.createServer(app)
const io = socket_io(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on('connection', socket=>{
    console.log('New Web Socket Connection...')

    socket.on('message', async (message, group_code, callback)=>{
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
        user.groups = [...user.groups, new_group._id]
        await new_group.save()
        await user.save()
        socket.join(new_group.group_code)
        callback(new_group)
    })

    socket.on('join-room', async (group_code, callback)=>{
        let group = await Group.findOne({group_code: group_code})
        let user = await User.findOne({socket_id: socket.id})
        if(group && user){
            group.members = [...group.members, user._id]
            user.groups = [...user.groups, group._id]
            console.log(user.groups)
            await group.save()
            await user.save()
            socket.join(group_code)
            callback(group)
        }
    })

    socket.on('get-groups', (group_codes)=>{
        group_codes.forEach(group_code=>{
            socket.join(group_code)
        })
    })
})


const PORT = process.env.PORT || 8080
server.listen(PORT, ()=> console.log(`listening on port ${PORT}`))