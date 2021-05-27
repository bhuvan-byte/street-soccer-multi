// const { Game } = require("./game");
// const {Player} = "./player";
// const { reset } = require("nodemon");
const welcomePage = document.getElementById('welcomePage');
const createBtn = document.getElementById('createButton');
const joinBtn = document.getElementById('joinButton');
const roomNameInput = document.getElementById('roomCode');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const roomCodeDiv = document.getElementById('roomCodeDiv');
const sock = io('http://localhost:8000');
const pingElem = document.querySelector('#ping_element');
createBtn.addEventListener('click', newRoom);
joinBtn.addEventListener('click', joinRoom);
var allowSetup = false,apna_player;
let game ;
function newRoom() {
    const username = document.getElementById('username').value;
    sock.emit('newRoom',username);
}

function joinRoom() {
    const roomName =  roomNameInput.value;
    const username = document.getElementById('username2').value;
    sock.emit('joinRoom',{roomName:roomName,username:username});
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
    apna_player.mouseSend();
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
        roomCodeDiv.style.display = 'block';
        const canvas = createCanvas(Width, Height);
        canvas.parent('canvasDiv');
        field = new Field();
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
    }
}