console.log('Express Tutorial')
const http = require('http')

const server = http.createServer((req, res) => {
    res.writeHead(201, {'content-type': 'text/html'})
    res.end('<h1>Home</h1>')
})

server.listen(5000)