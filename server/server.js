const http=require('http');
const express=require('express');
const fs = require('fs');
const path = require('path');
// const {Ball,Player}=require('./client/ball')
console.log(`server.js loaded ${Date.now()}`)

const app=express();
const server=http.createServer(app);
// use module.exports to export
module.exports.server = server;

app.get("/",function(req,res) { 
    fs.writeFile("./log.txt",JSON.stringify(req.headers,null,2),{flag:'w+'},err=>{});
    res.sendFile("/client/index.html",{root:path.join(__dirname,"../")});
})
app.use("/",express.static("client"));

// required only to run the file once
const stopwatch_ = require("../client/stopwatch.js");
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
