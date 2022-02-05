/// <reference path="../libraries/TSDef/p5.global-mode.d.ts" />
"use strict";
let game,sock;
let apna_player;
let bluePlayerImgList,redPlayerImgList,whitePlayerImgList;
let BlueFullImg, RedFullImg, WhiteFullImg ;
let roomList,field,slowIntervalId;
let joystick,canvas,shootingBtn;
let fps;
let startBtn, settingsBtn;
let navbarF = 0.07;
let openSans;  // ("/assets/OpenSans-Light.ttf")
let kickSound=document.querySelector('#kick-sound');
let goalSound=document.querySelector('#goal-sound');
let kickVolSlider = document.querySelector('#kick-vol-slider');
let goalVolSlider = document.querySelector('#goal-vol-slider');
// let bgmVolSlider = document.querySelector('#bgm-vol-slider');
let muteBtn = document.querySelector('#mute-btn');
let mute = 0;
let Cam = {
    shift:null, // Translation vector
    scale:1,
}
function getMouseTransformed(){
    let mx = (mouseX - Cam.shift.x)/Cam.scale;
    let my = (mouseY - Cam.shift.y)/Cam.scale;
    return {x:mx,y:my};
}
// let scoreAFrontEnd=0,scoreBFrontEnd=0; //to display scores on canvas

// getPing();
// sock.on('init', init);
// sock.on('init',(data)=>console.log("init",data));
// roomCodeDisplay.innerText = roomName;

// sock.on('failedToJoinRoom',handleFailedToJoinRoom);

function handleFailedToJoinRoom(msg){
    console.log(msg);
    // reset(); // does not work
}


const pressed={
    'KeyA':0,
    'KeyW':0,
    'KeyD':0,
    'KeyS':0
};
const moveKeyMap={
    'ArrowLeft':'KeyA',
    'ArrowUp':'KeyW',
    'ArrowRight':'KeyD',
    'ArrowDown':'KeyS',
}

// variable game is defined before calling onsock()
function onsock(){
    console.log('onsock called!');
    sock.on('clock',(data) => {
        // console.log(data);
        const {playerData,ballData} = data; // get player data every clock cycle
        game.updateClient(playerData,ballData);  // update game object client side.
        if(apna_player) {
            sock.emit('mouse',getMouseTransformed());
            // apna_player.mouseSend(); // NEEDS TO BE REMOVED BECAUSE WE DONT NEED EVERY PLAYER'S MOUSE DATA
            apna_player.shootingSend();
            apna_player.joystickSend();
        }
        else set_apna_player();
        
    });

    function set_apna_player(){
        apna_player = game.players[sock.id];
        console.log(`set_apna_player meise bol rhaa hu.${sock.id}, ${apna_player}`)
        if(!apna_player) {console.log("apnaplayer still not defined",game.players,sock.id);}
        // if(apna_player) apna_player.strokeColor="#00ff08";
        // apna_player.client();
    }

    let go321 = document.querySelector('#go321');
    go321.style.display = 'none';
    sock.on('countDown',(countDownTime)=>{
        // console.log(`countdown-signal recieved ${countDownTime}`);
        go321.style.display = '';
        setTimeout(() => {
            go321.style.display = 'none';
        }, countDownTime);
    });

    sock.on('play-sound',(event)=>{
        if(mute==1){
            return;
        }
        let bgVolSlider = document.querySelector('#bg-vol-slider');
        // let soundsVolume = soundsVolumeInput.value/100;
        let kickSound=document.getElementById('kick-sound');
        let goalSound=document.getElementById('goal-sound');
        kickSound.volume = document.querySelector('#kick-vol-slider').value;
        goalSound.volume = document.querySelector('#goal-vol-slider').value;
        if(event=='kick'){
            kickSound.play();
        }
        if(event=='goal'){
            goalSound.play();
        }
    });
    sock.on('timeLeft',(timeLeft)=>{
        timeLeft = Math.floor(timeLeft);
        // console.log(`timeLeft = ${timeLeft}`);
        let min = Math.floor(timeLeft/60);
        let sec = timeLeft%60;
        if(sec<10){sec='0'+sec.toString(10); }
        const timeLeftHtml = document.getElementById('time-left');
        timeLeftHtml.innerText=`${min}:${sec}`;
        if(timeLeft<1){
            const finalScoreBoard = document.getElementById('final-score-board');
            const finalFinalScoreA = document.getElementById('final-score-a');
            const finalFinalScoreB = document.getElementById('final-score-b');            
            const scoreBoardA = document.getElementById('scoreboard-a');
            const scoreBoardB = document.getElementById('scoreboard-b');
            finalFinalScoreA.innerText = scoreBoardA.innerText;
            finalFinalScoreB.innerText = scoreBoardB.innerText;
            finalScoreBoard.style.display="flex";
        }
    });
    sock.on('score',({scoreA,scoreB})=>{
        console.log(`scores -> ${scoreA} vs ${scoreB}`);
        let scoreBoardA = document.getElementById('scoreboard-a');
        let scoreBoardB = document.getElementById('scoreboard-b');
        
        scoreBoardA.innerText = scoreA;
        scoreBoardB.innerText = scoreB;
    });
    sock.on("changeTeam",(data)=>{
        // console.log("change team client called");
        game.players[data.id]?.changeTeam(data.team);
    });
}


function getPlayerName(){
    let pname = localStorage.getItem('name');
    if(pname){
        return pname.substring(0,8);
    } else{
        return 'nan';
    }
}

// p5.js functions
let ball_img;
function preload(){
    ball_img = loadImage('/assets/ball-dark-light.png');
    BlueFullImg = loadImage('/assets/blue.png');
    RedFullImg = loadImage('/assets/red.png');
    WhiteFullImg = loadImage('/assets/white.png');
    openSans = loadFont("/assets/OpenSans-Light.ttf");
}
function mouseWheel(e){
    let f = Math.pow(1.001, e.delta);
    Cam.scale /= f;
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function setup() {
    // console.log('setup');
    // loader.style.display = 'none';
    // reload_constants();
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvasDiv');
    textFont('Georgia');
    textSize(20);
    field = new Field();
    bluePlayerImgList = extractImage(BlueFullImg);
    redPlayerImgList = extractImage(RedFullImg);        
    whitePlayerImgList = extractImage(WhiteFullImg);

    
    sock = io({query:{roomName:roomName,username:getPlayerName()}});
    game = new Game(roomName);
    // game.ball.clientInit(ball_img);
    setEventListener();
    onsock();
    document.querySelector('#loading').style.display = 'none';
    let inviteModal = document.getElementById('invite-modal-text-area')
    inviteModal.innerText = document.location.href;
    // Cam.shift = createVector(0,0);
    // setupDone = true;
    // fullscreen(1);
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
function draw() {
    // if(!allowSetup) return;
    // scale(1.1);
    // translate(-canvas.width/2,-canvas.height/2);
    // scale(Cam.scale);
    // translate(Cam.px,Cam.py);
    // translate(canvas.width/2,canvas.height/2);
    // scale(Cam.scale);
    // translate(-C.Width/2,-C.Height/2);
    // translate(C.Width/2,C.Height/2);
    let tfactor = 0.7;
    // let cfactor = 1-1/Cam.scale;
    let cfactorx = 1-1/Cam.scale*canvas.width/C.Width;
    let cfactory = 1-1/Cam.scale*canvas.height/C.Height;
    // console.log(canvas.width);
    let focus = createVector(0,0);
    focus.x = clamp(tfactor*(C.Width/2-apna_player?.x),-cfactorx*C.Width/2,cfactorx*C.Width/2);
    focus.y = clamp(tfactor*(C.Height/2-apna_player?.y),-cfactory*C.Height/2,cfactory*C.Height/2);
    
    // Cam.y = windowHeight*navbarF;
    Cam.shift = createVector(0,0);
    Cam.shift.add(0,windowHeight*navbarF);
    Cam.shift.add(focus.x,focus.y);
    Cam.shift.add(-C.Width/2,-C.Height/2);
    Cam.shift.mult(Cam.scale);
    Cam.shift.add(canvas.width/2,canvas.height/2);
    
    // translate(Cam.x,Cam.y);
    translate(Cam.shift);
    scale(Cam.scale);

    // translate(Cam.scale*canvas.width/2,0)
    // translate(-mouseX,-mouseY);
    field.display();
    push();
    fill('#0000FF');
    text(`fps:${Math.floor(frameRate()/3)*3}`,15,15);
    pop();
    game.display();
    // stroke('rgb(255,0,0)')
    // rect(0,0,window.innerWidth,window.innerHeight);
}
