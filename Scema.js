const { Schema, model } = require('mongoose')

const schema = new Schema({
    chatId: Number,
    right: Number,
    wrong: Number
})

module.exports = model('userInfo', schema)