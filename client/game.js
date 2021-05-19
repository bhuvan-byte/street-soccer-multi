// const { reset } = require("nodemon");

const welcomePage = document.getElementById('welcomePage');
const createBtn = document.getElementById('createButton');
const joinBtn = document.getElementById('joinButton');
const roomNameInput = document.getElementById('roomCode');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const sock = io('http://localhost:8000');
createBtn.addEventListener('click', newRoom);
joinBtn.addEventListener('click', joinRoom);
var allowSetup = false;

function newRoom() {
    console.log('create room button clicked');
    sock.emit('newRoom');
}

function joinRoom() {
    const roomName =  roomNameInput.value;
    console.log(`join room clicked with code = ${roomName}`);
    sock.emit('joinRoom', roomName);
}

sock.on('init', setup1);
sock.on('gameCode', handleGameCode);
sock.on('failedToJoinRoom',handleFailedToJoinRoom);

function setup1(playerNo) {
    console.log(`playerNo = ${playerNo}`);
    let isAdmin=false;
    if(playerNo===1)isAdmin=true;
    apna_player = new Player(playerNo, random(255), random(255), random(255), random(Width) + gap + goalW, random(Height), 30, radians(random(360)),isAdmin);
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
        background(50, 168, 82); // green color
        noFill(); // to tell shapes are not to filled with some color

        // grid for temporary support 

        // stroke(20, 130, 60);
        // for (var i = 0; i < 20; i++) {
        //     line(0, i * Height / 20, Width, i * Height / 20); // horizontal
        // }
        // for (var i = 0; i < 40; i++) {
        //     line(i * Width / 40, 0, i * Width / 40, Height); // vertical
        // }

        strokeWeight(2);
        stroke(255, 255, 255); // white color to draw shapes
        // center circle
        circle(Width / 2, Height / 2, 70);

        // center line
        line(Width / 2, Height / 20, Width / 2, 19 * Height / 20);

        //left goalpost + line
        rect(gap, Height / 2 - goalH / 2, goalW, goalH);
        line(gap + goalW, Height / 20, gap + goalW, 19 * Height / 20);

        //right goalpost + line
        rect(Width - goalW - gap, Height / 2 - goalH / 2, goalW, goalH);
        line(Width - goalW - gap, Height / 20, Width - goalW - gap, 19 * Height / 20);

        // top and bottom outside lines
        line(Width / 20 + gap, Height / 20, 19 * Width / 20 - gap, Height / 20);
        line(Width / 20 + gap, 19 * Height / 20, 19 * Width / 20 - gap, 19 * Height / 20);


        // goal keeper's rectangles
        // left,right
        rect(3 * Width / 40, Height / 2 - goalH, goalW * 2, goalH * 2);
        rect(Width - 7 * Width / 40, Height / 2 - goalH, goalW * 2, goalH * 2);

        // bigger rectangles
        rect(3 * Width / 40, Height / 4, 6 * Width / 40, Height / 2);
        rect(Width - 9 * Width / 40, Height / 4, 6 * Width / 40, Height / 2);

        // ball.display();

        // for(var i=0;i<10;i++){
        //     players[i].display();
        // }
        apna_player.display();
        // sock.emit('player',apna_player);
    }
}