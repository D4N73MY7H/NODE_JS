const EventEmitter = require('events')
const http = require('http')

class Sales extends EventEmitter {
    constructor() {
        super()
    }
}

const customEmitter = new Sales()


customEmitter.on('response', () => {
    console.log('data received')
})

customEmitter.on('response', () => {
    console.log('some other logic')
})

customEmitter.on('response', (name, id) => {
    console.log(`data received user ${name} with id ${id}`)
})

customEmitter.emit('response', 'John', 30)

// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================

const server = http.createServer()

server.on('request', (req, res) => {
    console.log('request received')
    res.end('request received')
})

server.on('close', () => {
    console.log('server closed')
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Waiting for requests...')
})