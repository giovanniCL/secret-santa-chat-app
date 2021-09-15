const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../schemas/User')


const router = express.Router()
router.use(express.json())

router.post('/signup', async (req, res)=>{
    const user_check = await User.findOne({username: req.body.username})
    if(user_check) return res.send({
        success: false,
        message: 'username already taken',
    })
    const salt = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const new_user = new User({
        username: req.body.username,
        password: hashedPassword,
        groups: []
    })
    new_user.save().then((user, error)=>{
        if(error) return res.status(500).send(error)
        const token = jwt.sign({id: user._id}, process.env.SECRET,{
            expiresIn: 86400
        })
        res.status(200).send({
            sucess: true,
            auth: true,
            token: token
        })
    })
})

router.post('/login', async(req, res)=>{
    try{
        const user = await User.findOne({username: req.body.username})
        if(!user) return res.json({auth: false, message: "user not found"})
    
        const password_valid = bcrypt.compareSync(req.body.password, user.password)
        if(!password_valid) return res.json({auth: false, message: "invalid password"})
    
        const token = jwt.sign({id: user._id},process.env.SECRET,{
            expiresIn: 86400
        })
    
        res.status(200).send({
            auth: true,
            token: token
        })
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/me', async (req, res)=>{
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    try{
        const decoded = await jwt.verify(token, process.env.SECRET)
        const user = await User.findOne({_id: decoded.id})
        if(!user) return res.send({auth: false, message: "user not found"})
        res.status(200).send({auth: true, user});

    }catch(error){
        res.status(500).send(error)
    }
})

router.post('/socket_id', async (req, res)=>{
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    try{
        const decoded = await jwt.verify(token, process.env.SECRET)
        const user = await User.findByIdAndUpdate({_id: decoded.id}, {socket_id: req.body.socket_id})
        if(user) return res.status(201).send({auth: true, message: "updated socket id"})
        return res.send({auth: false, message: "user not found"})

    }catch(error){
        res.status(500).send(error)
    }


})

module.exports = router