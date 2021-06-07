"use strict";
if(typeof module !="undefined"){
    // const { Player } = require("./player");
    global.Player = require("./player").Player;
    global.playerRadius = require("./constants.js").playerRadius;
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
        let player = new Player(sock.playerNo,Math.random()*400,Math.random()*400,playerRadius,false,sock.username,sock);
        this.players[sock.id] = player;
    }
    update(){
        for(let [key,player] of Object.entries(this.players)){
            player.update();
        }
        for(let [key,player] of Object.entries(this.players)){
            player.update();
        }
        // Object.keys(dictionary).length
        let players = Object.values(this.players);
        for(let i=0; i<players.length;i++){
            for(let j=i+1; j<players.length; j++){
                players[i].collide(players[j]);
            }
        }
    }
    display(){
        for(let key in this.players){
            this.players[key].display();
        }
    }
    updateData(playerData){
        // const t0 = performance.now();
        for(let key in playerData){
            // console.log(`key = ${key}`);
            // console.log(`playerDat[key].username= ${playerData[key].username}`);
            if(!(key in this.players)){
                this.players[key] = new Player(key,0,0,playerRadius,playerData[key].username);
            }
            Object.assign(this.players[key],playerData[key]);
            if(this.players[key].teamName == 'A'){
                this.players[key].color = "#F00";
            } else if(this.players[key].teamName == 'B'){
                this.players[key].color = "#00B";
            }
        }
        for(let key in this.players){
            if(!(key in playerData)){
                delete this.players[key];
            }
        }
        // const t1 = performance.now();
        // console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
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
        // console.info(playerData);
        this.io.in(this.roomName).emit("clock",playerData);
    }
}
if (typeof module != "undefined"){
    module.exports = {
        Game: Game,
    }
}