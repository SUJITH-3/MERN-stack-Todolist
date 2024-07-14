const mongoose = require('mongoose')
const schema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },

})
const model = mongoose.model("todolist", schema)
module.exports = model