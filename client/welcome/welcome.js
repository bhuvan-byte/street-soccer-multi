"use strict";
let roomList,field,slowIntervalId;
let joinBtns = [];
let saveBtn = document.getElementById('save-name-btn');
let nam = document.getElementById('player-name');

if(document.cookie && nam){
    // name= takes 5 characters hence we ignore those 5.
    nam.value = localStorage.getItem('name');
}

saveBtn.addEventListener('click',()=>{
    localStorage.setItem('name',nam.value);
})

// const loader = document.getElementById('loading');
// setTimeout(() => {
//     loader.style.display = 'none';
// }, 500);

// sock.on('get-room-list', showRoomList);
// setTimeout(function askRoomList() {
//     sock.emit('get-room-list'); // ask for room list from websockets.js every 1 second
//     if(!allowSetup) setTimeout(askRoomList,1000);
// }, 1000);
window.scrollTo(0,1);

fetchRoomList();
async function fetchRoomList(){
    const response = await fetch("/room/allrooms");
    const data = await response.json();
    showRoomList(data);
    setTimeout(fetchRoomList,1000);
}

function joinRoom(roomName){
    let joinRoomrl = document.location.href+`room/${roomName}`;
    document.location.replace(joinRoomrl)
}

function showRoomList(data){
    let room_list = document.getElementById('room-list');
    let newRoomList = '';
    joinBtns = [];
    for(let room in data){
        newRoomList+=`<tr class="table-dark">
            <td>${room.toUpperCase()}</td>
            <td>${data[room]}</td>
            <td><button class="btn btn-sm btn-outline-primary join-btn" onClick="joinRoom('${room}')">Join</button></td>
        </tr>`
        // btn.addEventListener('click',(e)=>{
        //     console.log(e);
        // })
        // newRoomList+=`<button class="btn btn-primary room-list-item">${room} ${data[room]}</button>`;
        // console.log(`room -> ${room}, no of players -> ${data[room]}`);
    }
    if(newRoomList.length ==0) {
        newRoomList = `<td colspan="3"><center class="text-white bg-dark">No rooms online.<br>Create one.</center></td>`;
    }
    if(newRoomList!==roomList){
        room_list.innerHTML = newRoomList;
        roomList = newRoomList;
    }
}
