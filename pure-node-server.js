const http2 = require('http2')
const server = http2.createServer()
const dataSize = 50 * 1024 * 1024
const data = Buffer.from(new Uint8Array(dataSize))

server.on('error', (err) => console.error(err))

server.on('stream', (stream) => {
    stream.on('error', err => {
        if (err) {
            console.log("Stream error", err)
        }
    })
    stream.end(data, err => {
        if (err) {
            console.error(err) // always shows error on each request
            return
        }
        console.log('qweqwe')
    })
});

server.listen(3000) // https://localhost:8444
