const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Group = require('../schemas/Group')
const User = require('../schemas/User')

const router = express.Router()
router.use(express.json())

router.get('/all', async (req,res)=>{
    const token = req.headers['x-access-token']
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    try{
        const decoded = await jwt.verify(token, process.env.SECRET)
        const user = await User.findById({_id: decoded.id})
        if(!user) return res.status(500).send({success: false, message: "There was an error finding the user"})
        let groups = await Group.find({
            _id:{ $in: user.groups}
        })
        if(groups) return res.status(200).send({success: true, groups})
        return res.send({success: false, message: "There was an error retrieving groups"})

    }catch(error){
        res.status(500).send(error)
    }
})

module.exports = router