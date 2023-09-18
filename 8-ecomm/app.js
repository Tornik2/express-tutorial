require('dotenv').config()
require('express-async-errors')
//morgan
const morgan = require('morgan')
// express
const express = require('express')
const app = express()

//DB
const connectDB = require('./db/connect')

//ErrorHandler + NotFound
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFound = require('./middleware/not-found')

// router
const routerFirst = require('./routes/authRouter')

app.use(morgan('tiny'))

app.use(express.json())

app.use('/', routerFirst)

app.use(notFound)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()