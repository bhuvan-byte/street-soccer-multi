"use strict";
class Game{
    constructor(roomName){
        this.players = {};
        this.roomName = roomName;
        this.ready = false; // currently unused
        this.intervalId = null;
        this.ballHolder = null;
        this.ball = new Ball();
    }
    run(){
        this.intervalId = setInterval(() => {
            this.update();
            this.serverSend();
        }, 16);
    }
    stop(){
        clearInterval(this.intervalId);
    }
    addPlayer(sock){
        let player = new Player(sock.id,Math.random()*400,Math.random()*400,C.playerRadius,false,sock.username,sock);
        this.players[sock.id] = player;
    }
    shoot(mouse,id){
        this.players[id].thetaHandler(mouse.x,mouse.y);
        let canShoot = this.ball.isCollide(this.players[id]);
        if(canShoot){
            this.ballHolder = null;
            let theta = this.players[id].theta;
            let radSum =1+ C.playerRadius + C.ballBigRadius;
            this.ball.x = this.players[id].x + Math.cos(theta)*radSum; // to change playerRad
            this.ball.y = this.players[id].y + Math.sin(theta)*radSum;
            this.ball.vx = this.players[id].vx + Math.cos(theta)*C.shootSpeed;
            this.ball.vy = this.players[id].vy + Math.sin(theta)*C.shootSpeed;
        }
    }
    update(){ // server side update
        // Ball collision and possession
        let newHolder = null;
        for(let key in this.players){
            let collides = this.ball.isCollide(this.players[key]);
            if(collides){
                if(newHolder == null){
                    newHolder = key;
                }else {
                    newHolder = null;
                    break;
                }
            }
        }
        if(!newHolder) { // nobody has the ball
            this.ball.update();
        } else if(newHolder === this.ballHolder){
            this.ball.updateFollow(this.players[newHolder]);
        } else { // possesion change
            this.ball.updateFollow(this.players[newHolder]);
        }
        this.ballHolder = newHolder;
        
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
    display(){ // client side function 
        this.ball.display();
        for(let key in this.players){
            this.players[key].display();
        }
    }
    updateClient(playerData,ballData){ // client side update called every clock cycle
        // why is client sending ball data to server?

        // const t0 = performance.now();
        Object.assign(this.ball,ballData);
        for(let key in playerData){
            // console.log(`key = ${key}`);
            // console.log(`playerDat[key].username= ${playerData[key].username}`);
            if(!(key in this.players)){
                this.players[key] = new Player(key,0,0,C.playerRadius,playerData[key].username);
            }
            Object.assign(this.players[key],playerData[key]);
            // if(this.players[key].teamName == 'A'){
            //     this.players[key].strokeColor = "rgba(255,0,0,0.6)";
            // } else if(this.players[key].teamName == 'B'){
            //     this.players[key].strokeColor = "rgba(0,0,255,0.6)";
            // }
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
            if(key==this.ballHolder){
                playerData[key].hasBall = 1;
            } else{
                playerData[key].hasBall = 0;
            }
        }
        // WHY is below code not working !!?
        // console.info(Object.entries);
        // for(let [key,value] in Object.entries(this.players)){
        //     console.log(key,value);
        //     // playerData[key] = value.getData();
        // }
        // console.info(playerData);
        io.in(this.roomName).emit("clock",{playerData:playerData,ballData:this.ball.getData()});
        return playerData;
    }
}
if (typeof module != "undefined"){
    module.exports = {
        Game: Game,
    }
}