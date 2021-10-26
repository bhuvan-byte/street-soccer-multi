const http=require('http');
const express=require('express');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const { customAlphabet } = require('nanoid');
const alphabet = '0123456789abcdefghjkmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);
const mongoose = require('mongoose');
const UserModel = require('./User.js');
// const {Ball,Player}=require('./client/ball')
console.log(`server.js loaded ${Date.now()}`)

const app=express();
const server=http.createServer(app);
// use module.exports to export
module.exports.server = server;

// Cookies and User IDs
app.use(cookieParser());
const db = require('./keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


app.get("/",async function(req,res) { 
    fs.writeFile("./logs/log.txt",JSON.stringify(req.headers,null,2),{flag:'w+'},err=>{});
    try{
        let client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
        let useragent = req.headers['user-agent'];
        let uid=null,user=null;
        if(req.cookies["uid"]){
            uid = req.cookies["uid"];
            user = await UserModel.findOne({uid:uid}).exec();
            if(!user) user = UserModel({uid:uid});
        }else{
            user = await UserModel.findOne({recentIp:client_ip}).exec();
            if(user){
               uid = user.uid; 
            }else{
                uid = nanoid();   
                user = UserModel({uid:uid});
            }
            res.cookie(`uid`,`${uid}`,{secure: true,sameSite: 'lax',});
        }
        // console.log(`uid=${uid}`);
        user.recentIp = client_ip;
        let dateIST = new Date(new Date().getTime() + (new Date().getTimezoneOffset() + 330)*60000).toString();
        user.visits.push({ip:client_ip,useragent:useragent,date:dateIST});
        await user.save();
        res.sendFile("/client/index.html",{root:path.join(__dirname,"../")});
    }catch(err){
        console.log("Error mongodb UID",err);
        res.sendFile("/client/index.html",{root:path.join(__dirname,"../")});
    }
    
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
