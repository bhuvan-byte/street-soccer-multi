const socketio = require('socket.io');
// server.js does not run again because it is already executed
const { server } = require("./server.js");
const { newRoomName } = require('./utils');
const {Game} = require("../client/game");
let games = {};
let idToRoom = {};

const io = socketio(server,{
    cors:{
        origin:'*',
    },
});
let intervalId = setInterval(() => {
    
    for(let [key,game] of Object.entries(games)){
        if(!game.ready) continue;
        game.update();
        game.serverSend();
    }
}, 1600);
//io.sockets.something and io.something are same thing
io.on("connection", (sock) => {
    console.log(`Client Id ${sock.id} connected`);
    sock.on("ping",(sendtime)=>{
        sock.emit("ping",sendtime);
    });
    sock.on("disconnect", () => {
        console.log(`Client Id ${sock.id} disconnected`);
    });

    sock.on('newRoom',handleNewRoom);
    sock.on('joinRoom',handleJoinRoom);
    function newPlayer(roomName){
        idToRoom[sock.id] =roomName;
        sock.emit('gameCode',roomName);
        sock.join(roomName);
        console.log(`playerid ${sock.id} joined the room ${roomName}`);
        const noOfPlayersInRoom = io.sockets.adapter.rooms.get(roomName).size;
        sock.number =noOfPlayersInRoom;
        const game = games[roomName];
        game.addPlayer(sock);
        sock.emit('init',{number:sock.number,roomName:roomName});
        io.in(roomName).emit('newPlayer',{id:sock.id,playerNo:sock.number});
    }
    
    function handleNewRoom(){
        let roomName = newRoomName(4);
        games[roomName] = new Game(roomName,io);
        console.log("roomName",games[roomName].roomName);
        newPlayer(roomName);
        games[roomName].ready = true;
    }
    
    function handleJoinRoom(roomName){
        console.log(`requesting to join room ${roomName}`);
        if(io.sockets.adapter.rooms.has(roomName)){
            newPlayer(roomName);
        } else{
            sock.emit('failedToJoinRoom','room does not exist');
        }

    }
    // function handleKeyDown(){

    // }
    
    
});
