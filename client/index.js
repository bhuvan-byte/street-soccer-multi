// const { Game } = require("./game");
// const {Player} = "./player";

// const { C.picHeight, C.picWidth } = require("./constants");

// const player = require("./player");

// const { reset } = require("nodemon");

var allowSetup = false,apna_player;
let game ;
let bluePlayerImgList;
let redPlayerImgList;

getPing();
sock.on('init', init);
sock.on('gameCode', handleGameCode);
sock.on('failedToJoinRoom',handleFailedToJoinRoom);
// sock.on('newPlayer',(data)=>{
//     console.info(data);
//     let player = new Player(data.playerNo,0,0,C.playerRadius,false,data.username);

//     game.players[data.id]  = player;
// });
sock.on("joinTeam",(data)=>{
    try {
        game.players[data.id].changeTeam(data.team);
    } catch (err) {
        console.error(err);
    }
});
const COUNTER_MAX = 20;
let clock_counter = COUNTER_MAX;
sock.on('clock',(data)=>{
    const {playerData,ballData} = data;
    game.updateClient(playerData,ballData); 
    if(apna_player) apna_player.mouseSend();
    
    
    clock_counter -= 1;
    if(clock_counter == 0){
        clock_counter = COUNTER_MAX;
        extractOnlinePlayers(playerData);
        handleUpdateTeams(playerData);
    }
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
    // reset(); // does not work
}


let ball_img;
function preload(){
    ball_img = loadImage('assets/ball.png');
    BlueFullImg = loadImage('assets/blue.png');
    RedFullImg = loadImage('assets/red.png');
    WhiteFullImg = loadImage('assets/white.png');
}

function extractImage(fullImage){
    let x=0,y=0,imageList = [];
    for(let r=0;r<4;r++){
        // let oneAnimation = [];
        y=r*C.picHeight;
        x=0;
        for(let c=0;c<3;c++){
            let img = fullImage.get(x,y,C.picWidth,C.picHeight);
            imageList.push(img);
            x+=C.picWidth;
        }
    }
    let img = fullImage.get(0,C.picHeight,C.picWidth,C.picHeight);
    imageList.push(img); imageList.push(img); imageList.push(img);
    return imageList;
}

function setup() {
    if (allowSetup) {
        console.log('setup');
        welcomePage.style.display = 'none';
        others.style.display = 'block';
        const canvas = createCanvas(C.Width, C.Height);
        canvas.parent('canvasDiv');
        field = new Field();
        // ball = new Ball(ball_img);
        bluePlayerImgList = extractImage(BlueFullImg);
        redPlayerImgList = extractImage(RedFullImg);        
        whitePlayerImgList = extractImage(WhiteFullImg);
    }
}

function draw() {
    if (allowSetup) {
        // console.log("draw");
        field.display();
        // ball.display();
        game.display();
    }
}