const http = require('http')

http.createServer((req, res) => {
res.write("on the way to being a trap macalin")
res.end()
}
).listen(3000)

console.log('server started on port 3000')
