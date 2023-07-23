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

process.on('SIGINT', () => {
  wss.clients.forEach((client) => {
    client.close()
  })
  server.close(() => {
    shutdownDB()
  })
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

  db.run(`INSERT INTO visitors (count, time)
    VALUES (${numClients}, datetime('now'))
  `)

  ws.on('close', () => {
    wss.broadcast(`current visitors ${numClients}`)
    console.log('client has disconnected');
  })
})

/** Begin database */
const sql = require('sqlite3')
const db = new sql.Database(':memory:')

db.serialize(() => {
  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    )
  `)
})

function getCounts() {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  })
}

function shutdownDB () {
  getCounts()
  console.log('shutting down db..');
  db.close()
}