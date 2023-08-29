const express = require('express')
const people = require('./data')
const app = express()

app.use(express.static('./methods-public'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/api/people', (req, res) => {
  res.status(200).json({ success: true, data: people })
})

app.post('/login', (req, res) => {
    console.log(req.body)
    res.send(`post ${req.body.name}`)
})

app.post('/api/people', (req, res) => {
    console.log(req.body)
    res.status(200).json({person: req.body.name})
})

app.listen(5000, ()=> {
    console.log('port 3000+2000');
})