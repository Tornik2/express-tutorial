const mongoose = require('mongoose')
const connection = 'mongodb+srv://tornik2:gemoze23@newcluster.bohjcb5.mongodb.net/03-Tsk?retryWrites=true&w=majority'

const connectDB = (url) => {
    mongoose.connect(connection, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
}

    
module.exports = connectDB