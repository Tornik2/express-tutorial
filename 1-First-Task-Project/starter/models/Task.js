const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'must proveide dmame mas long sentence UUUUUUUUYYYYY']
    }, 
    completed:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task', taskSchema)