// this file is not run or imported elsewhere, it is to be used if required later
if(typeof module !="undefined"){
    // const { Player } = require("./player");
    Player = require("./player").Player;
    console.log("inside this",this);
    console.log("Player=",Player);   
}
class Game{
    constructor(roomName){
        this.players = {};
        this.roomName = roomName;
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
        io.in(this.roomName).emit("clock",playerData);
    }
}
if (typeof module != "undefined"){
    module.exports = {
        Game: Game,
    }
}