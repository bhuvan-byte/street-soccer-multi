/// <reference path="../libraries/TSDef/p5.global-mode.d.ts" />
"use strict";
let game ;
let bluePlayerImgList,redPlayerImgList,whitePlayerImgList;
let BlueFullImg, RedFullImg, WhiteFullImg ;
let roomList,field,slowIntervalId;
let fps;
// let kickSound=document.getElementById('kick-sound');
// let goalSound=document.getElementById('goal-sound');
let bgm;
// let scoreAFrontEnd=0,scoreBFrontEnd=0; //to display scores on canvas

// getPing();
// sock.on('init', init);
sock.on('init',(data)=>console.log("init",data));
roomCodeDisplay.innerText = roomName;

// sock.on('failedToJoinRoom',handleFailedToJoinRoom);

function handleFailedToJoinRoom(msg){
    console.log(msg);
    // reset(); // does not work
}
// sock.on("changeTeam",(data)=>{
//     console.log("change team client called");
//     try {
//         game.players[data.id].changeTeam(data.team);
//     } catch (err) {
//         console.error(err);
//     }
// });


sock.on('clock',onClock);
function onClock(data){
    console.log(data);
    // const {playerData,ballData} = data; // get player data every clock cycle
    // game.updateClient(playerData,ballData);  // update it in game.js
    // if(apna_player) apna_player.mouseSend(); // NEEDS TO BE REMOVED BECAUSE WE DONT NEED EVERY PLAYER'S MOUSE DATA
}

$('#go321').hide();
sock.on('countDown',(countDownTime)=>{
    // console.log(`countdown-signal recieved ${countDownTime}`);
    $('#go321').show();
    setTimeout(() => {
        $('#go321').hide();
    }, countDownTime);
});

sock.on('play-sound',(event)=>{
    // console.log('in play-sound', event);
    let soundsVolume = soundsVolumeInput.value/100;
    kickSound.volume = soundsVolume;
    goalSound.volume = soundsVolume/5;
    if(event=='kick'){
        kickSound.play();
    }
    if(event=='goal'){
        goalSound.play();
    }
});

sock.on('score',({scoreA,scoreB})=>{
    // console.log(`scoreA = ${scoreA}, scoreB = ${scoreB}`);
    // to display score on canvas
    // scoreAFrontEnd = scoreA;
    // scoreBFrontEnd = scoreB;
    // scoreBoard.innerHTML = `${scoreA} - ${scoreB}`;
    scoreBoardA.innerText = scoreA;
    scoreBoardB.innerText = scoreB;
});





let ball_img;
function preload(){
    ball_img = loadImage('/assets/ball-dark-light.png');
    BlueFullImg = loadImage('/assets/blue.png');
    RedFullImg = loadImage('/assets/red.png');
    WhiteFullImg = loadImage('/assets/white.png');
}

function setup() {
    // console.log('setup');
    // loader.style.display = 'none';
    const canvas = createCanvas(C.Width,C.Height);
    canvas.parent('canvasDiv');
    textFont('Georgia');
    strokeWeight(1);
    textSize(20);
    field = new Field();
    bluePlayerImgList = extractImage(BlueFullImg);
    redPlayerImgList = extractImage(RedFullImg);        
    whitePlayerImgList = extractImage(WhiteFullImg);
    // setupDone = true;
    // fullscreen(1);
}

function draw() {
    // if(!allowSetup) return;
    // scale(1.1);
    field.display();
    push();
    fill('#0000FF');
    text(`fps:${Math.floor(fps)}`,15,15);
    pop();
    // game.display();
}
