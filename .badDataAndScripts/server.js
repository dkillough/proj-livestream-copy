const http = require('http')
const fs = require('fs').promises
const dv = require('./old-script')

http.createServer((req, res) => {
    fs.readFile(__dirname + '/index.html').then(contents => {
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        res.end(contents);
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
    })
}).listen(3000)

