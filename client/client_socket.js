// const sock = io.connect('http://localhost:8000');



// setInterval(() => {
//     let sendtime = Date.now();
//     sock.emit("ping",sendtime);
// }, 1000);
// sock.on("ping",(sendtime)=>{
//     let ping = Date.now() - sendtime;
//     // console.log(`ping=${ping}, sendtime=${sendtime}`);
// });
// sock.on('init',handleInit);
// // sock.on('roomName',handleRoomName);
// // sock.on('player_positions',drawPlayers)

// function handleInit(playerNumber){
//     console.log('init');

// }