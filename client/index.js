/// <reference path="./libraries/TSDef/p5.global-mode.d.ts" />
"use strict";
var allowSetup = false,apna_player;
let game ;
let bluePlayerImgList,redPlayerImgList,whitePlayerImgList;
let BlueFullImg, RedFullImg, WhiteFullImg ;
let roomList,field,slowIntervalId;

getPing();
sock.on('init', init);
sock.on('gameCode', handleGameCode);
sock.on('failedToJoinRoom',handleFailedToJoinRoom);
sock.on('get-room-list', showRoomList);
// sock.on('newPlayer',(data)=>{
//     console.info(data);
//     let player = new Player(data.playerNo,0,0,C.playerRadius,false,data.username);

//     game.players[data.id]  = player;
// });
sock.on("changeTeam",(data)=>{
    try {
        game.players[data.id].changeTeam(data.team);
    } catch (err) {
        console.error(err);
    }
});


sock.on('clock',onClock);
function onClock(data){
    const {playerData,ballData} = data; // get player data every clock cycle
    game.updateClient(playerData,ballData);  // update it in game.js
    if(apna_player) apna_player.mouseSend(); 
}

let intervalID = setInterval(() => {
    sock.emit('get-room-list'); // ask for room list from websockets.js every 1 second
}, 1000);


function handleGameCode(gameCode) { //to display room code
    roomCodeDisplay.innerText = gameCode;
}

function handleFailedToJoinRoom(msg){
    console.log(msg);
    // reset(); // does not work
}


let ball_img;
function preload(){
    ball_img = loadImage('assets/ball.png');
    BlueFullImg = loadImage('assets/blue.png');
    RedFullImg = loadImage('assets/red.png');
    WhiteFullImg = loadImage('assets/white.png');
}

function setup() {
    if(!allowSetup) return;
    console.log('setup');
    const canvas = createCanvas(C.Width, C.Height);
    canvas.parent('canvasDiv');
    field = new Field();
    bluePlayerImgList = extractImage(BlueFullImg);
    redPlayerImgList = extractImage(RedFullImg);        
    whitePlayerImgList = extractImage(WhiteFullImg);
}

function draw() {
    if(!allowSetup) return;
    field.display();
    game.display();
}