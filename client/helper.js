"use strict";
function showRoomList(data){
    let room_list = document.getElementById('room-name-list');
    let newRoomList = '';
    for(let room in data){
        newRoomList+=`<button class="btn btn-primary room-list-item">${room} ${data[room]}</button>`;
        // console.log(`room -> ${room}, no of players -> ${data[room]}`);
    }
    if(newRoomList.length ==0) {
        newRoomList = "<center>No rooms online.<br>Create one.</center>";
    }
    if(newRoomList!==roomList){
        room_list.innerHTML = newRoomList;
        roomList = newRoomList;
    }
}
function init(data){
    if(!setupDone) {
        setTimeout(init, 100); /* this checks the flag every 100 milliseconds*/
    } else {
        inithelper(data);
    }
}
function inithelper(data) {
    let {playerNo,roomName} = data;
    console.log(`playerNo = ${playerNo}`);
    if(!allowSetup) game = new Game(roomName);
    
    onClock(data);
    for(const key in game.players) game.players[key].changeTeam();
    if(allowSetup) return;
    
    pocketSound.play();
    allowSetup = true;
    // setup();
    welcomePage.style.display = 'none';
    gameScreenDiv.classList.remove('dont-show-at-welcome');
    document.removeEventListener("mousedown",roomJoinDynamicClick);
    others.style.display = 'block'; // what is this
    slowIntervalId = setInterval(() => {
        fps = frameRate();
        extractOnlinePlayers(game.players);
        handleUpdateTeams(game.players);
    }, 1000);
    if(sock.id in game.players){
        apna_player = game.players[sock.id];
        apna_player.strokeColor="#00ff08";
        apna_player.client();
    }else{
        console.log("my player undefined");
        alert("rejoin!");
    }
}

function handleUpdateTeams(playerData){
    // UNSAFE TOWARDS INJECTIONS
    // let team_a = '<ul>';
    // let team_b = '<ul>';
    // for(let key in playerData){
    //     // console.log(playerData[key].teamName);
    //     if(playerData[key].teamName==="A")
    //         team_a+=`<li>`+playerData[key].username+`</li>`;
    //     if(playerData[key].teamName==="B") 
    //         team_b+=`<li>`+playerData[key].username+`</li>`;
    // }
    // team_a+='</ul>';
    // team_b+='</ul>';
    // teamA.innerHTML=team_a;
    // teamB.innerHTML=team_b;
    let teamAnew = document.createElement('ol');
    let teamBnew = document.createElement('ol');

    for(let key in playerData){
        let li = document.createElement('li');
        li.innerText = playerData[key].username;
        if(playerData[key].teamName==="A"){
            teamAnew.appendChild(li);
        }
        if(playerData[key].teamName==="B"){
            teamBnew.appendChild(li);
        }        
    }
    teamA.innerHTML = teamAnew.innerHTML;
    teamB.innerHTML = teamBnew.innerHTML;
}

function extractOnlinePlayers(playerData){
    // UNSAFE TOWARDS INJECTIONS
    // let online_players='<ul>OnlinePlayers';

    // for(let key in playerData){ 
    //     // console.log(playerData[key].username);
    //     online_players+=`<li>`+playerData[key].username+`</li>`;
    // }
    // online_players+='</ul>';
    // OnlinePlayers.innerHTML=online_players;

    // other way which is safe towards injections
    // NEVER USE .INNERHTML TAG ON USER INPUT 
    // ALWAYS USE .INNETTEXT WHEN DEALING WITH USER INPUT
    // console.info(playerData);
    let onlinePlayersNew = document.createElement('ol');
    for(let key in playerData){
        let li = document.createElement('li');
        li.innerText = playerData[key].username;
        onlinePlayersNew.appendChild(li);
    }
    // console.log(`onlinePlayersNew -> ${onlinePlayersNew}`);
    OnlinePlayers.innerHTML = onlinePlayersNew.innerHTML;
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

