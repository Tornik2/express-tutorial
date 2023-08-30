const express = require('express')
const app = express()
const tasksRoute = require('./routes/tasks')

app.use(express.json())

app.use('/api/v1/tasks' , tasksRoute)

app.listen(3000, () => {
    console.log('port 30 + 2970')
})