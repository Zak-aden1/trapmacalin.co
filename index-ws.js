const express = require('express')
const server = require('http').createServer()

const app = express()

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname})
})

server.on('request', app)

server.listen(3000, () => {
  console.log('listening on port 3000');
})

/** WebSockets */
const webSocketServer = require("ws").Server;

const wss = new webSocketServer({server: server})

wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data)
  })
}

wss.on('connection', (ws) => {
  console.log();
  const numClients = wss.clients.size
  console.log('stream connected', numClients);

  wss.broadcast(`current visitors ${numClients}`)

  if (ws.OPEN === ws.readyState) {
    ws.send('welcome to my server')
  }

  ws.on('close', () => {
    wss.broadcast(`current visitors ${numClients}`)
    console.log('client has disconnected');
  })
})