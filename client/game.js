if(typeof module !="undefined"){
    // const { Player } = require("./player");
    Player = require("./player").Player;
    console.log("inside this",this);
    console.log("Player=",Player);   
}
class Game{
    constructor(roomName,io){
        this.players = {};
        this.roomName = roomName;
        this.io = io;
        this.ready = false;
    }
    addPlayer(sock){
        let player = new Player(sock.playerNo,Math.random()*400,Math.random()*400,20,false,sock);
        // console.log("player,sockid",player,sock.id);
        this.players[sock.id] = player;
    }
    update(){
        for(let [key,player] of Object.entries(this.players)){
            player.update();
        }
    }
    display(){
        for(let key in this.players){
            this.players[key].display();
        }
    }
    updateData(playerData){
        const t0 = performance.now();
        for(let key in playerData){
            if(!(key in this.players)){
                this.players[key] = new Player(key,0,0,playerRadius);
            }
            Object.assign(this.players[key],playerData[key]);
        }
        const t1 = performance.now();
        console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    }
    serverSend(){
        let playerData={};
        // console.log(Object.keys(this.players).length);
        for(let key in this.players){
            playerData[key] = this.players[key].getData();
        }
        // WHY is below code not working !!?
        // for(let [key,value] in Object.entries(this.players)){
        //     console.log(key,value);
        //     // playerData[key] = value.getData();
        // }
        this.io.in(this.roomName).emit("clock",playerData);
    }
}
if (typeof module != "undefined"){
    module.exports = {
        Game: Game,
    }
}