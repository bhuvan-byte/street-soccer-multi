const socketio = require('socket.io');
// server.js does not run again because it is already executed
const { server} = require("./server.js");
const { newRoomName } = require('./utils');
const {Game} = require("./game.js");
const assert = require('assert');

const io = socketio(server, {cors:{ origin:'*',}});

global.io = io;



// console.log(`io`,io);
//io.sockets.something and io.something are same thing
io.on("connection", (sock) => {
    // console.log(`Client Id ${sock.id}`,sock.handshake.query,"connected.");
    sock.roomName = sock.handshake.query.roomName;
    sock.username = sock.handshake.query.username;
    
    if (!(sock.roomName in games)) {
        // testing purposes
        if(sock.roomName=="test"){
            games["test"] = new Game("test");
            games["test"].run();
        }
        
        else {console.error(`Room ${sock.roomName} not exists!`);
        return;}
    }
    newPlayer();
    // handleStartPause();
    // setTimeout(() => {handleStartPause()}, 2000);
    sock.on("ping",(sendtime)=>{
        sock.emit("ping",sendtime);
    });
    sock.on("disconnect", () => {
        if(sock.roomName in games && sock.id in games[sock.roomName].players){
            console.log(`deleting player id,name = ${games[sock.roomName].players[sock.id]}, ${sock.username}`);
            console.log(`length = ${Object.keys(games[sock.roomName].players).length}`)
            delete games[sock.roomName].players[sock.id];            
            if(Object.keys(games[sock.roomName].players).length == 0){
                console.log(`deleting room ${sock.roomName}`);
                clearInterval(games[sock.roomName].intervalId);
                delete games[sock.roomName];
            }
        }
        console.log(`Client Id ${sock.id} disconnected`);
    });
    sock.on("keypress",(keyInfo)=>{
        if(sock.roomName in games && sock.id in games[sock.roomName].players){
            games[sock.roomName].players[sock.id].moveHandler(keyInfo.ecode,keyInfo.direction);
        }else {
            console.log("not defined//refresh required");
        }
    });
    sock.on("mouse",(mouse)=>{
        if(sock.roomName in games && sock.id in games[sock.roomName].players){
            games[sock.roomName].players[sock.id].thetaHandler(mouse.x,mouse.y);
        }else {
            console.log("not defined//refresh required");
        }
    });
    sock.on("shoot",(mouse)=>{
        if(sock.roomName in games && sock.id in games[sock.roomName].players){
            // console.log("shooting...");
            games[sock.roomName].shoot(mouse,sock.id);
        }else {
            console.log("not defined//refresh required");
        }
    });
    // sock.on('newRoom',handleNewRoom);
    // sock.on('joinRoom',handleJoinRoom);
    // sock.on('joinDefaultRoom',handleJoinDefaultRoom);
    sock.on('changeTeam',handlechangeTeam);
    // sock.on('get-room-list',handleGetRoomList);
    sock.on('start/pause-signal',handleStartPause);

    function newPlayer(){
        // idToRoom[sock.id] =roomName;
        // sock.emit('gameCode',roomName);
        sock.join(sock.roomName);
        console.log(`playerid ${sock.id} joined the room ${sock.roomName}`);
        const noOfPlayersInRoom = io.sockets.adapter.rooms.get(sock.roomName).size;
        sock.number = noOfPlayersInRoom;
        
        const game = games[sock.roomName];
        // if(Object.keys(games[roomName].players).length<2)
        game.addPlayer(sock.id,sock.username);
        // sock.emit('init',{playerNo:sock.number,roomName:roomName});
        game.sendInitData();
        // io.in(roomName).emit('newPlayer',{id:sock.id,playerNo:sock.number,username:sock.username});
    }
    
    function handleNewRoom(data){
        let {roomName,username} = data;
        if(roomName===null) {
            roomName = newRoomName(4);
            while(io.sockets.adapter.rooms.has(roomName)){
                roomName = newRoomName(4);
            }
        }
        // console.log(`${username} joined the room telling this from handle join room in websocket.js`);
        games[roomName] = new Game(roomName);
        // console.log("roomName",games[roomName].roomName);
        newPlayer(roomName,username);
        games[roomName].run();
    }
    
    function handleJoinRoom(data){
        const {roomName,username} = data;
        console.log(data);
        console.log(`requesting to join room ${data.roomName}, ${data.username}`);
        console.log(`${roomName},${username}`);
        if(io.sockets.adapter.rooms.has(roomName)){
            newPlayer(roomName,username);
        } else{
            sock.emit('failedToJoinRoom','room does not exist');
        }
    }
    function handleJoinDefaultRoom(username){
        let roomName = "ROOM";
        if(!games[roomName]) {
            handleNewRoom({roomName:"ROOM",username:username});
        }else{
            handleJoinRoom({roomName:"ROOM",username:username});
        }
    }
    function handlechangeTeam(team){
        try{
            assert(team=='A' || team=='B');
            io.in(sock.roomName).emit("changeTeam",{id:sock.id,team:team});
            games[sock.roomName].players[sock.id].teamName=team;
        }catch(err){
            console.log(err);
        }
    }

    function handleGetRoomList(){
        let roomList = {};
        for(let room in games){
            // BUG: Possible error: Cannot read property 'size' of undefined
            if(io.sockets.adapter.rooms.has(room))
                roomList[room] = io.sockets.adapter.rooms.get(room).size;
            else {
                console.log(`SAVED FROM CRASHING!`);
            }
        }
        sock.emit('get-room-list',roomList);
    }

    function handleStartPause(){
        console.log(`start pause button pressed by ${sock.id} in room ${sock.roomName}`);
        if(sock.roomName){
            let isRunning = games[sock.roomName].isRunning ;
            if(isRunning){
                games[sock.roomName].isRunning = false;
                games[sock.roomName].timer.stop();
            }else{
                games[sock.roomName].start();
            }
            console.log(`isRunning = ${games[sock.roomName].isRunning}`);
            // if(games[sock.roomName].isRunning){
            //     games[sock.roomName].stop();
            // } else{
            //     games[sock.roomName].run();
            // }
        } else{
            console.log(`SAVED FROM sock.roomName crash ${sock.roomName}`);
        }
    }
    
    
});
