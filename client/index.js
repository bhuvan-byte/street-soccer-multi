// const { reset } = require("nodemon");
const welcomePage = document.getElementById('welcomePage');
const createBtn = document.getElementById('createButton');
const joinBtn = document.getElementById('joinButton');
const roomNameInput = document.getElementById('roomCode');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const sock = io('http://localhost:8000');
createBtn.addEventListener('click', newRoom);
joinBtn.addEventListener('click', joinRoom);
var allowSetup = false,apna_player;

function newRoom() {
    console.log('create room button clicked');
    sock.emit('newRoom');
}

function joinRoom() {
    const roomName =  roomNameInput.value;
    console.log(`join room clicked with code = ${roomName}`);
    sock.emit('joinRoom', roomName);
}

sock.on('init', init);
sock.on('gameCode', handleGameCode);
sock.on('failedToJoinRoom',handleFailedToJoinRoom);
sock.on('clock',(data)=>{
    console.log(data);
});
function init(playerNo) {
    console.log(`playerNo = ${playerNo}`);
    let isAdmin=false;
    if(playerNo===1)isAdmin=true;
    apna_player = new Player(playerNo, random(Width) + gap + goalW, random(Height), 20,isAdmin);
    allowSetup = true;
    setup();
}

function handleGameCode(gameCode) {
    roomCodeDisplay.innerText = gameCode;
}

function handleFailedToJoinRoom(msg){
    console.log(msg);
    reset();
}



function setup() {
    if (allowSetup) {
        console.log('setup');
        welcomePage.style.display = 'none';
        createCanvas(Width, Height);
        field = new Field();
        // sock.on('player_coordinates',drawPlayers);
        // players = [];
        // for(var i=0;i<10;i++){
        //     players.push(new Player(random(255),random(255),random(255),random(Width)+gap+goalW,random(Height),30,radians(random(360))));
        // }
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
        apna_player.display();
        // sock.emit('player',apna_player);
    }
}