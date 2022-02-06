const socketio = require('socket.io');
// server.js does not run again because it is already executed
const { server} = require("./server.js");
const { newRoomName } = require('./utils');
const {Game} = require("./game.js");
const assert = require('assert');

const io = socketio(server, {cors:{ origin:'*',}});

global.io = io;


//io.sockets.something and io.something are same thing
io.on("connection", (sock) => {
    // console.log(`Client Id ${sock.id}`,sock.handshake.query,"connected.");
    sock.roomName = sock.handshake.query.roomName;
    sock.username = sock.handshake.query.username;
    
    if (!(sock.roomName in games)) {
        // testing purposes
        // if(sock.roomName=="test"){
        //     games["test"] = new Game("test");
        //     games["test"].run();
        // }
        // else 
        {console.error(`Room ${sock.roomName} not exists!`);
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
            setTimeout(() => {
                if(Object.keys(games[sock?.roomName]?.players ?? {}).length != 0) return;
                console.log(`deleting room ${sock.roomName}`);
                clearInterval(games[sock.roomName]?.intervalId);
                delete games[sock.roomName];
                console.log(`delete room func ${Object.keys(games).length}`);
            }, 5000);
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
    sock.on("joystick",(dxdy)=>{
        if(sock.roomName in games && sock.id in games[sock.roomName].players){
            games[sock.roomName].players[sock.id].joystickHandler(dxdy);
        } else{
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
    sock.on("tackle",()=>{
        games[sock.roomName]?.tackle(sock.id);
    });
    sock.on('game-over', ()=>{
        games[sock.roomName].resetScores();
    })
    sock.on('name',(pname)=>{
        try{
            io.in(sock.roomName).emit("name",{id:sock.id,pname:pname});
            games[sock.roomName].players[sock.id].changeName(pname);
        }catch(err){
            console.log(err);
        }
    })
    // sock.on('newRoom',handleNewRoom);
    // sock.on('joinRoom',handleJoinRoom);
    // sock.on('joinDefaultRoom',handleJoinDefaultRoom);
    sock.on('changeTeam',(team)=>{
        try{
            assert(team=='A' || team=='B');
            io.in(sock.roomName).emit("changeTeam",{id:sock.id,team:team});
            games[sock.roomName].players[sock.id].teamName=team;
        }catch(err){
            console.log(err);
        }
    });
  
    // sock.on('get-room-list',handleGetRoomList);
    sock.on('start/pause-signal',handleStartPause);

    function handleStartPause(){
        console.log(`start pause button pressed by ${sock.id} in room ${sock.roomName}`);
        if(sock.roomName){
            broadcastTeamofPlayers();
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
        broadcastTeamofPlayers();
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
    function broadcastTeamofPlayers(){
        const players = games[sock.roomName]?.players;
        for(let playerid in players)
            io.in(sock.roomName).emit("changeTeam",{id:playerid,team:players[playerid]?.teamName});
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

    
    
    
});
