// // console.log("Hello Server");

// var http= require('http');

// http.createServer(function(request, response){
//     response.writeHead(200, {'Content-Type':'text/html'});
//     response.write("Hello Jamshedpur");
//     response.end("Hello World !");
// }).listen(8080);

//////////////////////////////////////

const express = require('express')
const app = express()
const port = 3000

// url - localhost:3000 method- GET
app.get('/', (req, res) => {
    res.send('Hello World! - GET')
  })
  
// url - localhost:3000 method- POST
app.post('/', (req, res) => {
    res.send('Hello World! - POST')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

