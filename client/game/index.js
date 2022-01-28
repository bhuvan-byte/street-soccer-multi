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
// let kickSound=document.getElementById('kick-sound');
// let goalSound=document.getElementById('goal-sound');
let bgm;
let Cam = {
    x:0,
    y:0,
    px:0,
    py:0,
    scale:1,
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

function reload_constants(){
C.Width = window.innerWidth ;
C.Height = window.innerHeight;
C.goalH = 100 ;
C.goalW = 50 ;
C.xGoalGap = C.Width / 40 ;
C.ygap = C.Height / 20;
C.xgap = C.xGoalGap + C.goalW;
C.backgroundColor = (4, 199, 75) ; // maybe unused
C.playerRadius = 12 ;
C.ballBigRadius = 15;
C.ballRadius = 10 ;
C.shootSpeed = 9;
C.playerAcc = 0.3 ;
C.playerAccFac = 0.7;
C.picWidth = 48 ;
C.picHeight = 48 ;
C.wall_e_ball = 0.9;
C.animationSpeed = 0.04 ; // it is ratio by which vel is multiplied
C.scaleFieldX = C.Width/40; // to multiply with coordinates from formation
C.scaleFieldY = C.Height/20;
C.countDown = 4000; // 3-2-1-go
}

function createHtmlElements(){
    startBtn = createButton('Start');
    startBtn.position(windowWidth/2-35,1);
    startBtn.addClass('btn btn-outline-dark');
    startBtn.mouseClicked(()=>{
        sock.emit('start/pause-signal');
    })
}

let ball_img;
function preload(){
    ball_img = loadImage('/assets/ball-dark-light.png');
    BlueFullImg = loadImage('/assets/blue.png');
    RedFullImg = loadImage('/assets/red.png');
    WhiteFullImg = loadImage('/assets/white.png');
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
    
    joystick = new VirtualJoystick({
        container : document.body,
        // strokeStyle1: 'cyan',
        // strokeStyle2: 'yellow',
        // strokeStyle3: 'pink',
        limitStickTravel: true,
        // stickRadius: 100,
        mouseSupport: true,// comment this to remove joystick from desktop site
    })

    joystick.addEventListener('touchStartValidation', (e)=>{
        var touch	= e.changedTouches[0];
		if( touch.pageY > window.innerHeight/2 && touch.pageX < window.innerWidth/2)
		    return true
        return false;
    })

    shootingBtn = new VirtualJoystick({
        container : document.body,
        limitStickTravel:true,
        mouseSupport:false,
        strokeStyle1: '#f1000077',
        strokeStyle3: '#e4353577',
    })

    shootingBtn.addEventListener('touchStartValidation', (e)=>{
        var touch	= e.changedTouches[0];
		if( touch.pageY > window.innerHeight/2 && touch.pageX > window.innerWidth/2)
		    return true
        return false;
    })

    createHtmlElements();
    sock = io({query:{roomName:roomName,username:localStorage.getItem('name')}});
    game = new Game(roomName);
    // game.ball.clientInit(ball_img);
    onsock();
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
    translate(canvas.width/2,canvas.height/2);
    scale(Cam.scale);
    translate(-C.Width/2,-C.Height/2);
    // translate(C.Width/2,C.Height/2);
    let tfactor = 0.7;
    // let cfactor = 1-1/Cam.scale;
    let cfactorx = 1-1/Cam.scale*canvas.width/C.Width;
    let cfactory = 1-1/Cam.scale*canvas.height/C.Height;
    // console.log(canvas.width);
    Cam.x = clamp(tfactor*(C.Width/2-apna_player?.x),-cfactorx*C.Width/2,cfactorx*C.Width/2);
    Cam.y = clamp(tfactor*(C.Height/2-apna_player?.y),-cfactory*C.Height/2,cfactory*C.Height/2);
    translate(Cam.x,Cam.y);
    // translate(Cam.scale*canvas.width/2,0)
    // translate(-mouseX,-mouseY);
    field.display();
    push();
    fill('#0000FF');
    text(`fps:${Math.floor(fps)}`,15,15);
    pop();
    game.display();
    // stroke('rgb(255,0,0)')
    // rect(0,0,window.innerWidth,window.innerHeight);
}
