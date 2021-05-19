const socketio = require('socket.io');
// server.js does not run again because it is already executed
const { server } = require("./server.js");
const { makeNewRoom } = require('./utils')
let players = [];
let clientRooms = {};

const io = socketio(server,{
    cors:{
        origin:'*',
    },
});
//io.sockets.something and io.something are same thing
io.on("connection", (sock) => {
    console.log(`Client Id ${sock.id} connected`);
    
    sock.on("ping",(sendtime)=>{
        sock.emit("ping",sendtime);
    });
    sock.on("disconnect", () => {
        console.log("Disconnected");
    });

    sock.on('newRoom',handleNewRoom);
    sock.on('joinRoom',handleJoinRoom);
    // sock.on('keyDown',handleKeyDown);

    
    function handleNewRoom(){
        let roomName = makeNewRoom(5);
        clientRooms[sock.id]=roomName;
        sock.emit('gameCode',roomName);
        sock.join(roomName);
        console.log(`playerid ${sock.id} joining the room ${roomName}`);
        sock.number=1;
        sock.emit('init',sock.number);        
    }
    function handleJoinRoom(roomName){
        console.log(`requesting to join room ${roomName}`);
        if(io.sockets.adapter.rooms.has(roomName)){
            sock.emit('gameCode',roomName);
            sock.join(roomName);
            console.log(`playerid ${sock.id} joining the room ${roomName}`);
            const noOfPlayersInRoom = io.sockets.adapter.rooms.get(roomName).size;
            sock.number =noOfPlayersInRoom;
            // console.info(io.sockets.adapter.rooms.get(roomName).size);
            // console.log(io.sockets.adapter.rooms[Object.keys(io.sockets.adapter.rooms)[0]]);
            sock.emit('init',sock.number);
        } else{
            sock.emit('failedToJoinRoom','room does not exist');
        }

    }
    // function handleKeyDown(){

    // }
    
    
});
