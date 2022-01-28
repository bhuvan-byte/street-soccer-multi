"use strict";
let roomList,field,slowIntervalId;
let joinBtns = [];
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

function hrefUpdate(inp){
    $('#popjoin').attr('href', `/room/${inp.value.toLowerCase()}`);
}


fetchRoomList();
async function fetchRoomList(){
    const response = await fetch("/room/allrooms");
    const data = await response.json();
    showRoomList(data);
    setTimeout(fetchRoomList,1000);
}


function showRoomList(data){
    let room_list = document.getElementById('room-list');
    let newRoomList = '';
    joinBtns = [];
    for(let room in data){
        newRoomList+=`<tr class="table-dark">
            <td>${room.toUpperCase()}</td>
            <td>${data[room]}</td>
            <td><a href="room/${room}" class="btn btn-sm btn-outline-primary">Join</a></td>
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
