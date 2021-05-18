const sock = io();
setInterval(() => {
    let sendtime = Date.now();
    sock.emit("ping",sendtime);
}, 1000);
sock.on("ping",(sendtime)=>{
    let ping = Date.now() - sendtime;
    // console.log(`ping=${ping}, sendtime=${sendtime}`);
});
username = "Player" ; 
sock.emit("newPlayer",username);
