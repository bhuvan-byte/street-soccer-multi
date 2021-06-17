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
sock.on('get-room-list', showRoomList);
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
    const {playerData,ballData} = data; // get player data every clock cycle
    game.updateClient(playerData,ballData);  // update it in game.js
    if(apna_player) apna_player.mouseSend(); 
    clock_counter -= 1;
    if(clock_counter == 0){ // after every 20 cycles get list of online players and their teams
        clock_counter = COUNTER_MAX;
        extractOnlinePlayers(playerData);
        handleUpdateTeams(playerData);
    }
});

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