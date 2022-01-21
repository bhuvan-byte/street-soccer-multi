/// <reference path="../libraries/TSDef/p5.global-mode.d.ts" />
"use strict";
let game,sock;
let apna_player;
let bluePlayerImgList,redPlayerImgList,whitePlayerImgList;
let BlueFullImg, RedFullImg, WhiteFullImg ;
let roomList,field,slowIntervalId;
let joystick;
let fps;
// let kickSound=document.getElementById('kick-sound');
// let goalSound=document.getElementById('goal-sound');
let bgm;
// let scoreAFrontEnd=0,scoreBFrontEnd=0; //to display scores on canvas

// getPing();
// sock.on('init', init);
// sock.on('init',(data)=>console.log("init",data));
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

const pressed={
    'KeyA':0,
    'KeyW':0,
    'KeyD':0,
    'KeyS':0
};
function setEventListener(){
    canvasDiv.addEventListener('mousedown',(e)=>{
        sock.emit("shoot",{x:mouseX,y:mouseY});
    });
    document.addEventListener('keydown',(e)=>{
        // console.log(e.code);
        if(!e.repeat && (e.code in pressed)){
            sock.emit("keypress",{ecode:e.code,direction:1});
            // this.moveHandler(e.code,1);
        }
    });
    document.addEventListener('keyup',(e)=>{
        if((e.code in pressed)){
            sock.emit("keypress",{ecode:e.code,direction:0});
            // this.moveHandler(e.code,0);
        }
    });
}

function onsock(){
    setEventListener();
    sock.on('clock',(data) => {
        // console.log(data);
        const {playerData,ballData} = data; // get player data every clock cycle
        game.updateClient(playerData,ballData);  // update game object client side.
        if(apna_player) {
            apna_player.mouseSend(); // NEEDS TO BE REMOVED BECAUSE WE DONT NEED EVERY PLAYER'S MOUSE DATA
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
}



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
    
    joystick = new VirtualJoystick({
        container : document.body,
        strokeStyle: 'cyan',
        limitStickTravel: true,
        stickRadius: 100,
        mouseSupport: true,// comment this to remove joystick from desktop site
    })

    sock = io({query:{roomName:roomName,username:"def"}});
    game = new Game(roomName);
    // game.ball.clientInit(ball_img);
    onsock();
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
    game.display();
}
