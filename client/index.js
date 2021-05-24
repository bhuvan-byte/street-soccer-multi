// const { Game } = require("./game");

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
let game ;
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
sock.on('newPlayer',(data)=>{
    game.players[data.id]  = new Player(data.playerNo,0,0,playerRadius,false);
});
sock.on('clock',(playerData)=>{
    // console.log(playerData);
    game.updateData(playerData);
    apna_player.mouseSend();
});
function init(data) {
    let {playerNo,roomName} = data;
    console.log(`playerNo = ${playerNo}`);
    game = new Game(roomName);
    let isAdmin=false;
    if(playerNo===1)isAdmin=true;
    // apna_player = new Player(playerNo, random(Width) + gap + goalW, random(Height), 20,isAdmin);
    allowSetup = true;
    setup();
    setTimeout(() => {
        if(sock.id in game.players){
            apna_player = game.players[sock.id];
            apna_player.client();
        }else{
            console.log("my player undefined");
        }
    }, 400);
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
        game.display();
        // apna_player.display();
        // sock.emit('player',apna_player);
    }
}