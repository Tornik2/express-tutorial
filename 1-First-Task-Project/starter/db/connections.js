const mongoose = require('mongoose')


const connectDB = (url) => {
    mongoose.connect(url, {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
}

    
module.exports = connectDB