const mongoose = require('mongoose')

const GroupSchema = new mongoose.Schema({
    name: String,
    group_code: String,
    members: Array
})

module.exports = mongoose.model('Group', GroupSchema)