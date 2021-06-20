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
function init(data) {
    let {playerNo,roomName} = data;
    console.log(`playerNo = ${playerNo}`);
    game = new Game(roomName);
    allowSetup = true;
    setup();
    welcomePage.style.display = 'none';
    topRow.classList.remove('dont-show-at-welcome');
    document.removeEventListener("mousedown",roomJoinDynamicClick);
    others.style.display = 'block'; // what is this
    onClock(data);
    for(const key in game.players) game.players[key].changeTeam();
    slowIntervalId = setInterval(() => {
        fps = frameRate();
        extractOnlinePlayers(game.players);
        handleUpdateTeams(game.players);
    }, 1000);
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

function extractOnlinePlayers(playerData){
    let online_players='<ul>OnlinePlayers';
    for(let key in playerData){
        // console.log(playerData[key].username);
        online_players+=`<li>`+playerData[key].username+`</li>`;
    }
    online_players+='</ul>';
    OnlinePlayers.innerHTML=online_players;
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

