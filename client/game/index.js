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
let scoreBoardA = document.getElementById('scoreboard-a')
let scoreBoardB = document.getElementById('scoreboard-b')
let inviteModal = document.getElementById('invite-modal-text-area');
let openSans;  // ("/assets/OpenSans-Light.ttf")
// let kickSound=document.getElementById('kick-sound');
// let goalSound=document.getElementById('goal-sound');
let bgm;
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

function copyUrl(){
    navigator.clipboard.writeText(document.location.href);
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
function setEventListener(){
    setInterval(() => {
        let tbodyRed = document.querySelector("#red-team tbody");
        let tbodyBlue = document.querySelector("#blue-team tbody");
        tbodyRed.innerHTML = tbodyBlue.innerHTML = "";
        for(const p of Object.values(game.players)){
            let tbody;
            if(p.teamName =='A') tbody = tbodyBlue;
            else tbody = tbodyRed;
            tbody.insertRow().insertCell().innerText = p.username;
        }
    }, 1000);
    canvasDiv.addEventListener('mousedown',(e)=>{
        sock.emit("shoot",getMouseTransformed());
    });
    document.querySelector('#tackle').addEventListener('touchstart',()=>{
        sock.emit("tackle")
    });
    document.addEventListener('keydown',(e)=>{
        // console.log(e.code);
        let ecode = e.code;
        if(ecode in moveKeyMap) ecode = moveKeyMap[ecode];
        if(!e.repeat && (ecode in pressed)){
            sock.emit("keypress",{ecode:ecode,direction:1});
            // this.moveHandler(e.code,1);
        }
        if(!e.repeat && ecode == "Space"){
            e.preventDefault();
            sock.emit("tackle");
        }
    });
    document.addEventListener('keyup',(e)=>{
        let ecode = e.code;
        if(ecode in moveKeyMap) ecode = moveKeyMap[ecode];
        if(!e.repeat && (ecode in pressed)){
            sock.emit("keypress",{ecode:ecode,direction:0});
            // this.moveHandler(e.code,1);
        }
    });
    joystick = new VirtualJoystick({
        container : document.querySelector("#canvasDiv"),
        // stickRadius : 30,
        innerRadius : 40,
        outerRadius : 50,
        stickRadius: 50,
        // strokeStyle1: 'cyan',
        // strokeStyle2: 'yellow',
        // strokeStyle3: 'pink',
        limitStickTravel: true,
        mouseSupport: true,// comment this to remove joystick from desktop site
    })

    joystick.addEventListener('touchStartValidation', (e)=>{
        var touch	= e.changedTouches[0];
		if(touch.pageX < window.innerWidth/2)
		    return true
        return false;
    })

    shootingBtn = new VirtualJoystick({
        container : document.querySelector("#canvasDiv"),
        limitStickTravel:true,
        innerRadius : 40,
        outerRadius : 50,
        stickRadius : 50,
        // mouseSupport:true,
        strokeStyle1: '#f1000077',
        strokeStyle3: '#e4353577',
    })

    shootingBtn.addEventListener('touchStartValidation', (e)=>{
        var touch	= e.changedTouches[0];
		if(touch.pageX > window.innerWidth/2)
		    return true
        return false;
    })
    document.querySelector("#start").addEventListener('click',()=>{
        sock.emit("start/pause-signal");
    });
    document.querySelector("#change-team").addEventListener('click',()=>{
        sock.emit('changeTeam', (apna_player.teamName== "A")?"B":"A" );
    });
}
// variable game is defined before calling onsock()
function onsock(){
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
        console.log(`scores -> ${scoreA} vs ${scoreB}`)
        scoreBoardA.innerText = scoreA;
        scoreBoardB.innerText = scoreB;
    });
    sock.on("changeTeam",(data)=>{
        // console.log("change team client called");
        game.players[data.id]?.changeTeam(data.team);
    });
}



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
function getPlayerName(){
    let pname = localStorage.getItem('name');
    if(pname){
        return pname.substr(0,8);
    } else{
        return 'nan';
    }
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
