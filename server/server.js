const http=require('http');
const express=require('express');
// const {Ball,Player}=require('./client/ball')
console.log(`server.js loaded ${Date.now()}`)

const app=express();
const server=http.createServer(app);
// use module.exports to export
module.exports.server = server;

app.use(express.static("client"));
app.get("/",function(req,res) {
    res.sendFile(__dirname+"/client/index.html")
})
// required only to run the file once
const constants_ = require("../client/constants.js");
const player_ = require("../client/player.js");
const ball_ = require("../client/ball.js");

const websocket=require('./websocket.js');
console.log(websocket);
server.on('error', (err) => {
    console.error('Server error:', err);
});
const port=process.env.PORT ?? 8000;
server.listen(port,()=>{
    console.log("server listening on port ",port);
});
