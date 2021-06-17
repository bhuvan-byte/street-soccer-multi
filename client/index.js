// const { Game } = require("./game");
// const {Player} = "./player";
// const { C.picHeight, C.picWidth } = require("./constants");

// const player = require("./player");

// const { reset } = require("nodemon");
"use strict";
var allowSetup = false,apna_player;
let game ;
let bluePlayerImgList,redPlayerImgList,whitePlayerImgList;
let BlueFullImg, RedFullImg, WhiteFullImg ;
let roomList,field;

getPing();
sock.on('init', init);
sock.on('gameCode', handleGameCode);
sock.on('failedToJoinRoom',handleFailedToJoinRoom);
// sock.on('newPlayer',(data)=>{
//     console.info(data);
//     let player = new Player(data.playerNo,0,0,C.playerRadius,false,data.username);

//     game.players[data.id]  = player;
// });
sock.on("joinTeam",(data)=>{
    try {
        game.players[data.id].changeTeam(data.team);
    } catch (err) {
        console.error(err);
    }
});
const COUNTER_MAX = 20;
let clock_counter = COUNTER_MAX;
sock.on('clock',(data)=>{
    const {playerData,ballData} = data;
    game.updateClient(playerData,ballData); 
    if(apna_player) apna_player.mouseSend();
    
    
    clock_counter -= 1;
    if(clock_counter == 0){
        clock_counter = COUNTER_MAX;
        extractOnlinePlayers(playerData);
        handleUpdateTeams(playerData);
    }
});

let intervalID = setInterval(() => {
    sock.emit('get-room-list');
}, 1000);

sock.on('get-room-list', showRoomList);

function handleGameCode(gameCode) {
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
    if (allowSetup) {
        console.log('setup');
        welcomePage.style.display = 'none';
        document.removeEventListener("mousedown",roomJoinDynamicClick);
        others.style.display = 'block';
        const canvas = createCanvas(C.Width, C.Height);
        canvas.parent('canvasDiv');
        field = new Field();
        // ball = new Ball(ball_img);
        bluePlayerImgList = extractImage(BlueFullImg);
        redPlayerImgList = extractImage(RedFullImg);        
        whitePlayerImgList = extractImage(WhiteFullImg);
    }
}

function draw() {
    if (allowSetup) {
        field.display();
        game.display();
    }
}