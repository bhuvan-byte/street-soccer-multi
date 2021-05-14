const http=require('http');
const express=require('express');
// const {Ball,Player}=require('./client/ball')


const app=express();
const server=http.createServer(app);
exports.server = server;
app.use(express.static("client"));
app.get("/",function(req,res) {
    res.sendFile(__dirname+"/client/index.html")
})


server.on('error', (err) => {
    console.error('Server error:', err);
});
const port=process.env.PORT || 8000;
server.listen(port,()=>{
    console.log("server listening on port ",port);
});
