const express = require('express')
const app = express()

require('dotenv').config()

const tasksRoute = require('./routes/tasks')
const notFound = require('./middleware/notFound')
const connectDB = require('./db/connections')
const errorHandlerMiddleware = require('./middleware/errorHandler')


app.use(express.json())
app.use('/' , express.static('./public'))
app.use('/api/v1/tasks' , tasksRoute)
app.use(notFound)
app.use(errorHandlerMiddleware)




const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(3000, () => {console.log('port 30 + 2970')
})
    } catch (error) {
        console.log(error)
    }
}

start()
