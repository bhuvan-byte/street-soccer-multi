/// <reference path="./libraries/TSDef/p5.global-mode.d.ts" />
"use strict";
var allowSetup = false,apna_player;
let game ;
let bluePlayerImgList,redPlayerImgList,whitePlayerImgList;
let BlueFullImg, RedFullImg, WhiteFullImg ;
let roomList,field,slowIntervalId;
let fps;
let kickSound=document.getElementById('kick-sound');
let goalSound=document.getElementById('goal-sound');
let bgm;
// let scoreAFrontEnd=0,scoreBFrontEnd=0; //to display scores on canvas

getPing();
sock.on('init', init);
sock.on('gameCode', handleGameCode);
sock.on('failedToJoinRoom',handleFailedToJoinRoom);
sock.on('get-room-list', showRoomList);
setTimeout(function askRoomList() {
    sock.emit('get-room-list'); // ask for room list from websockets.js every 1 second
    if(!allowSetup) setTimeout(askRoomList,1000);
}, 1000);
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
    if(apna_player) apna_player.mouseSend(); // NEEDS TO BE REMOVED BECAUSE WE DONT NEED EVERY PLAYER'S MOUSE DATA
}

sock.on('countDown',(countDownTime)=>{
    console.log(`countdown-signal recieved`);
    threeTwoOne.innerText = countDownTime;
    setTimeout(function doSomething() {
        countDownTime --;
        threeTwoOne.innerText = countDownTime;
        if(countDownTime==0) threeTwoOne.innerText = "";
        if(countDownTime>0) setTimeout(doSomething, 1000);
    }, 1000);
});

sock.on('play-sound',(event)=>{
    console.log('in play-sound', event);
    let kickVolume = kickVolumeInput.value/100;
    let goalVolume = goalVolumeInput.value/100;
    if(event=='kick'){
        kickSound.volume = kickVolume;
        kickSound.play();
    }
    if(event=='goal'){
        goalSound.volume = goalVolume;
        goalSound.play();
    }
});

sock.on('score',({scoreA,scoreB})=>{
    console.log(`scoreA = ${scoreA}, scoreB = ${scoreB}`);
    // to display score on canvas
    // scoreAFrontEnd = scoreA;
    // scoreBFrontEnd = scoreB;
    scoreBoard.innerHTML = `${scoreA} - ${scoreB}`;
});


function handleGameCode(gameCode) { //to display room code
    roomCodeDisplay.innerText = gameCode;
}

function handleFailedToJoinRoom(msg){
    console.log(msg);
    // reset(); // does not work
}


let ball_img;
function preload(){
    ball_img = loadImage('assets/ball-dark-light.png');
    BlueFullImg = loadImage('assets/blue.png');
    RedFullImg = loadImage('assets/red.png');
    WhiteFullImg = loadImage('assets/white.png');
}

function setup() {
    if(!allowSetup) return;
    console.log('setup');
    const canvas = createCanvas(C.Width,C.Height);
    canvas.parent('canvasDiv');
    textFont('Georgia');
    strokeWeight(1);
    textSize(20);
    field = new Field();
    bluePlayerImgList = extractImage(BlueFullImg);
    redPlayerImgList = extractImage(RedFullImg);        
    whitePlayerImgList = extractImage(WhiteFullImg);
    // fullscreen(1);
}

function draw() {
    if(!allowSetup) return;
    // scale(1.1);
    field.display();
    push();
    fill('#0000FF');
    text(`fps:${Math.floor(fps)}`,15,15);
    pop();
    game.display();
}
