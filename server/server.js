const http=require('http');
const express=require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const {nanoid,logip} = require("./utils.js");
const {UserModel,VisitModel} = require('./User.js');
const mongoose = require('mongoose');

require('dotenv').config();
const roomsRouter = require('./routes/rooms')
// const {Ball,Player}=require('./client/ball')
console.log(`server.js loaded ${Date.now()}`);
global.games = {};


const app=express();
const server=http.createServer(app);
module.exports.server = server;

app.set('view engine','ejs');

// Cookies and User IDs
app.use(cookieParser());
const db = process.env.DBPASS;

// Connect to MongoDB
mongoose
  .connect(db,{ useNewUrlParser: true ,useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.get("/", async function (req,res){ 
    await logip(req,res);
    // res.render('../client/welcome/welcome.ejs');
    res.sendFile("/client/welcome/welcome.html",{root:path.join(__dirname,"../")});
})
app.use("/",express.static("client"));


app.use('/room',roomsRouter)

app.use(process.env.DBROUTE, async (req,res)=>{
    let data = await UserModel.find();
    res.json(data);
});
// required only to run the file once
const stopwatch_ = require("./stopwatch.js");
const constants_ = require("../client/constants.js");
const player_ = require("./player.js");
const ball_ = require("./ball.js");

const websocket=require('./websocket.js');
console.log(websocket);
server.on('error', (err) => {
    console.error('Server error:', err);
});
const port=process.env.PORT ?? 8000;
server.listen(port,()=>{
    console.log("server listening on port ",port);
});
