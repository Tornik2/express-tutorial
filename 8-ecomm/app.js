require('dotenv').config()
require('express-async-errors')
//rest of the packages
const cookieParser = require('cookie-parser')
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
const authRouter = require('./routes/authRouter')
const userRouter =  require('./routes/userRouter')

app.use(morgan('tiny'))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.json())

app.get('/api/v1', (req, res)=> {
    
    res.send('good togo')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 5000

const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()