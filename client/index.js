// const { Game } = require("./game");
// const {Player} = "./player";

// const { picHeight, picWidth } = require("./constants");

// const player = require("./player");

// const { reset } = require("nodemon");
const welcomePage = document.getElementById('welcomePage');
const createBtn = document.getElementById('createButton');
const joinBtn = document.getElementById('joinButton');
const joinDefaultRoomBtn = document.getElementById('joinDefaultRoom');
const roomNameInput = document.getElementById('roomCode');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const roomCodeDiv = document.getElementById('roomCodeDiv');
const sock = io();
const pingElem = document.querySelector('#ping_element');

const configBtn = document.getElementById('config');
const closeConfBtn = document.getElementById('close-config');
const overlay = document.getElementById('overlay');
const modal = document.querySelector(configBtn.dataset.modalTarget);
const OnlinePlayers = document.getElementById('OnlinePlayers');
const teamAJoinBtn = document.getElementById('TeamAJoin');
const teamBJoinBtn = document.getElementById('TeamBJoin');
const teamA = document.getElementById('teamA');
const teamB = document.getElementById('teamB');

createBtn.addEventListener('click', newRoom);
joinBtn.addEventListener('click', joinRoom);
joinDefaultRoomBtn.addEventListener('click',joinDefaultRoom);


configBtn.addEventListener('click',confModalShow);
closeConfBtn.addEventListener('click',confModalClose);
teamAJoinBtn.addEventListener('click',JoinATeam);
teamBJoinBtn.addEventListener('click',JoinBTeam);

var allowSetup = false,apna_player;
let game ;
let bluePlayerImgList;
let redPlayerImgList;

function newRoom() {
    const username_raw = document.getElementById('username').value;
    const username = username_raw.substr(0,Math.min(10,username_raw.length));    
    console.log("new room make");
    sock.emit('newRoom',username);
}

function joinRoom() {
    const roomName =  roomNameInput.value;
    const username_raw = document.getElementById('username2').value;
    const username = username_raw.substr(0,Math.min(10,username_raw.length));
    sock.emit('joinRoom',{roomName:roomName,username:username});
}

function joinDefaultRoom(){
    const username_raw = document.getElementById('username3').value;
    const username = username_raw.substr(0,Math.min(10,username_raw.length));
    console.log(`${username} joining default room`);
    sock.emit('joinDefaultRoom',username);
}

function confModalShow(){
    modal.classList.add('active');
    overlay.classList.add('active');
}

function confModalClose(){
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function JoinATeam(){
    console.log('joining a team');
    sock.emit('joinTeamA');
}

function JoinBTeam(){
    console.log('joining b team');
    sock.emit('joinTeamB');
}

setInterval(() => {
    let sendtime = Date.now();
    sock.emit("ping",sendtime);
}, 1000);
let pingArray = [];
sock.on("ping",(sendtime)=>{
    let ping = Date.now() - sendtime;
    pingElem.innerText = `Ping ${ping}ms`;
});
sock.on('init', init);
sock.on('gameCode', handleGameCode);
sock.on('failedToJoinRoom',handleFailedToJoinRoom);
// sock.on('newPlayer',(data)=>{
//     console.info(data);
//     let player = new Player(data.playerNo,0,0,playerRadius,false,data.username);

//     game.players[data.id]  = player;
// });
sock.on('clock',(playerData)=>{
    game.updateData(playerData);
    if(apna_player) apna_player.mouseSend();
    extractOnlinePlayers(playerData);
    handleUpdateTeams(playerData);
});
function init(data) {
    let {playerNo,roomName} = data;
    console.log(`playerNo = ${playerNo}`);
    game = new Game(roomName);
    let isAdmin=false;
    if(playerNo===1)isAdmin=true;
    allowSetup = true;
    setup();
    setTimeout(() => {
        if(sock.id in game.players){
            apna_player = game.players[sock.id];
            apna_player.client();
        }else{
            console.log("my player undefined");
            alert("rejoin!");
        }
    }, 400);
}

function extractOnlinePlayers(playerData){
    let online_players='<ul>OnlinePlayers';
    for(let key in playerData){
        // console.log(playerData[key].username);
        online_players+=`<li>`+playerData[key].username+`</li>`;
    }
    online_players+='</ul>';
    OnlinePlayers.innerHTML=online_players;
}

function handleUpdateTeams(playerData){
    let team_a = '<ul>';
    let team_b = '<ul>';
    for(let key in playerData){
        // console.log(playerData[key].teamName);
        if(playerData[key].teamName==="A")
            team_a+=`<li>`+playerData[key].username+`</li>`;
        if(playerData[key].teamName==="B") 
            team_b+=`<li>`+playerData[key].username+`</li>`;
    }
    team_a+='</ul>';
    team_b+='</ul>';
    teamA.innerHTML=team_a;
    teamB.innerHTML=team_b;
}

function handleGameCode(gameCode) {
    roomCodeDisplay.innerText = gameCode;
}

function handleFailedToJoinRoom(msg){
    console.log(msg);
    reset();
}


let ball_img;
function preload(){
    ball_img = loadImage('assets/ball.png');
    BlueFullImg = loadImage('assets/blue.png');
    RedFullImg = loadImage('assets/red.png');
}

function extractImage(fullImage){
    let x=0,y=0,imageList = [];
    for(let r=0;r<4;r++){
        // let oneAnimation = [];
        y=r*picHeight;
        x=0;
        for(let c=0;c<3;c++){
            let img = fullImage.get(x,y,picWidth,picHeight);
            imageList.push(img);
            x+=picWidth;
        }
    }
    let img = fullImage.get(0,picHeight,picWidth,picHeight);
    imageList.push(img); imageList.push(img); imageList.push(img);
    return imageList;
}

function setup() {
    if (allowSetup) {
        console.log('setup');
        welcomePage.style.display = 'none';
        others.style.display = 'block';
        const canvas = createCanvas(Width, Height);
        canvas.parent('canvasDiv');
        field = new Field();
        ball = new Ball(ball_img);
        bluePlayerImgList = extractImage(BlueFullImg);
        redPlayerImgList = extractImage(RedFullImg);        
        
    }
}

function drawPlayers(players) {
    for (player of players) {
        player.display();
    }
}

function draw() {
    if (allowSetup) {
        field.display();
        ball.display();
        game.display();
    }
}