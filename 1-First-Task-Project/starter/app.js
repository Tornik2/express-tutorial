const express = require('express')
const app = express()
const tasksRoute = require('./routes/tasks')

const connectDB = require('./db/connections')

app.use(express.json())

app.use('/api/v1/tasks' , tasksRoute)

const start = async () => {
    try {
        await connectDB()
        app.listen(3000, () => {console.log('port 30 + 2970')
})
    } catch (error) {
        console.log(error)
    }
}

start()
