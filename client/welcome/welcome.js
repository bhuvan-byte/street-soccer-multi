"use strict";
let roomList,field,slowIntervalId;
// const loader = document.getElementById('loading');
// setTimeout(() => {
//     loader.style.display = 'none';
// }, 500);

// sock.on('get-room-list', showRoomList);
// setTimeout(function askRoomList() {
//     sock.emit('get-room-list'); // ask for room list from websockets.js every 1 second
//     if(!allowSetup) setTimeout(askRoomList,1000);
// }, 1000);

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