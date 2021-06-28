const sock = io();
const welcomePage = document.getElementById('welcomePage');
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinButton');
const joinDefaultRoomBtn = document.getElementById('joinDefaultRoom');
const roomNameInput = document.getElementById('roomCode');
const roomCodeDisplay = document.getElementById('roomCodeDisplay');
const roomCodeDiv = document.getElementById('roomCodeDiv');
const pingElem = document.querySelector('#ping_element');
let timeLeftHtml = document.getElementById('time-left');
const topRow = document.querySelector('.top-row');
const startBtn = document.getElementById('start-btn');
const configBtn = document.getElementById('config');
const closeConfBtn = document.getElementById('close-config');
const overlay = document.getElementById('overlay');
const modal = document.querySelector(configBtn.dataset.modalTarget);
const OnlinePlayers = document.getElementById('OnlinePlayers');
const teamAJoinBtn = document.getElementById('TeamAJoin');
const teamBJoinBtn = document.getElementById('TeamBJoin');
const teamA = document.getElementById('teamA');
const teamB = document.getElementById('teamB');
const roomListElem = document.getElementById('room-name-list');
const canvasDiv = document.getElementById('canvasDiv');
let isRunning = false;
const others = document.getElementById('others');
const kickVolumeInput = document.getElementById('kick-volume');
const goalVolumeInput = document.getElementById('goal-volume');
createBtn.addEventListener('click', newRoom);
joinBtn.addEventListener('click', joinRoom);
joinDefaultRoomBtn.addEventListener('click',joinDefaultRoom);


roomListElem.addEventListener('mouseup',roomJoinDynamicClick);


configBtn.addEventListener('click',confModalShow);
closeConfBtn.addEventListener('click',confModalClose);
teamAJoinBtn.addEventListener('click',JoinATeam);
teamBJoinBtn.addEventListener('click',JoinBTeam);
startBtn.addEventListener('click',handleStartPause);
// $(".card").each(function(index){
//     $(this).keyup(function(e){
//         if(e.keyCode === 13){
//             $(this).find("button").click();
//         }
//     });
// });
// stopped working as html changed and we removed card class
document.addEventListener("keydown",(e)=>{
    if(e.key == "Enter"){
        joinDefaultRoomBtn.click();
    }
});

function roomJoinDynamicClick(e){
    roomName = e.target.innerText.split(" ")[0];
    console.log(roomName);
    const username_raw = document.getElementById('username').value;
    const username = username_raw.substr(0,Math.min(10,username_raw.length));
    sock.emit('joinRoom',{roomName:roomName,username:username});
}

function newRoom() {
    const username_raw = document.getElementById('username').value;
    const username = username_raw.substr(0,Math.min(10,username_raw.length));    
    console.log("new room make");
    sock.emit('newRoom',{roomName:null,username:username});
}

function joinRoom() {
    const roomName =  roomNameInput.value;
    const username_raw = document.getElementById('username').value;
    const username = username_raw.substr(0,Math.min(10,username_raw.length));
    sock.emit('joinRoom',{roomName:roomName,username:username});
}

function joinDefaultRoom(){
    const username_raw = document.getElementById('username').value;
    const username = username_raw.substr(0,Math.min(10,username_raw.length));
    console.log(`${username} joining default room`);
    sock.emit('joinDefaultRoom',username);
}

function handleStartPause(){
    // if(isRunning){
    //     isRunning=false;
    // } else{
    //     isRunning=true;
    // }
    sock.emit('start/pause-signal');
}
// let curTime=300;
// const gameTimerInterval = setInterval(updateClock,1000);
// function updateClock(){
//     if(isRunning){
//         curTime--;
//         let min = Math.floor(curTime/60);
//         let sec = curTime%60;
//         if(sec<10){sec='0'+sec.toString(10); }
//         timeLeft.innerText=`${min}:${sec}`;
//     }
// }
sock.on('timeLeft',(timeLeft)=>{
    timeLeft = Math.floor(timeLeft);
    console.log(`timeLeft = ${timeLeft}`);
    let min = Math.floor(timeLeft/60);
    let sec = timeLeft%60;
    if(sec<10){sec='0'+sec.toString(10); }
    timeLeftHtml.innerText=`${min}:${sec}`;
});

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
    sock.emit('changeTeam',"A");
    // sock.emit('changeTeamA');
}

function JoinBTeam(){
    console.log('joining b team');
    sock.emit('changeTeam',"B");
    // sock.emit('changeTeamB');
}

function getPing(){
    setInterval(() => {
        let sendtime = Date.now();
        sock.emit("ping",sendtime);
    }, 1000);
    let pingArray = [];
    sock.on("ping",(sendtime)=>{
        let ping = Date.now() - sendtime;
        pingElem.innerText = `Ping ${ping}ms`;
    });
}