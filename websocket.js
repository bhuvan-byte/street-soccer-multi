const socketio = require('socket.io');
// server.js does not run again because it is already executed
const { server } = require("./server.js");


const io = socketio(server);

io.on("connection", (sock) => {
    console.log(`Client Id ${sock.id} connected`);
    
    sock.on("ping",(sendtime)=>{
        sock.emit("ping",sendtime);
    });
    sock.on("disconnect", () => {
        console.log("Disconnected");
    });
});
