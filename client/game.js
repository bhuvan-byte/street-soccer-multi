"use strict";
class Game{
    constructor(roomName){
        this.players = {};
        this.roomName = roomName;
        this.ready = false; // currently unused
        this.intervalId = null;
        this.ballHolder = null;
        this.ball = new Ball();
        this.isRunning = false;
        this.timer = new Stopwatch(300*1000);
        // this.curTime;
    }
    run(){
        // this.isRunning = true;
        this.intervalId = setInterval(() => {
            this.update();
            this.serverSend();
        }, 16);
        this.sendTime(); //start emitting time left at 1 second interval 
    }
    stop(){
        // this.isRunning = false;
        clearInterval(this.intervalId);
    }
    sendTime(){
        setInterval(() => {
            io.in(this.roomName).emit('timeLeft',this.timer.getMilliseconds()/1000); 
        }, 1000);
        // Date.
    }
    addPlayer(id,username){
        let player = new Player(id,Math.random()*C.Width,Math.random()*C.Height,C.playerRadius,false,username);
        this.players[id] = player;
    }
    shoot(mouse,id){ // called from websocket.js
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
            io.in(this.roomName).emit('play-sound',"kick");
        }
    }
    update(){ // server side update
        // Ball collision and possession
        let newHolder = null;
        for(let key in this.players){
            let collides = this.ball.isCollide(this.players[key]);
            this.players[key].hasBall = false; // all set to false
            if(collides){
                if(newHolder == null){
                    newHolder = key;
                }else {
                    newHolder = null;
                    break;
                }
            }
        }
        let isGoal=false;
        if(!newHolder) { // nobody has the ball
            this.ball.update();
            isGoal = this.ball.wallCollide(C.wall_e_ball);
        } else if(newHolder === this.ballHolder){
            this.ball.updateFollow(this.players[newHolder]);
            isGoal = this.ball.wallCollide(C.wall_e_ball/9);
        } else { // possesion change
            this.ball.updateFollow(this.players[newHolder]);
            isGoal = this.ball.wallCollide(C.wall_e_ball/9);
        }
        if(newHolder) this.players[newHolder].hasBall = true;
        if(isGoal){
            io.in(this.roomName).emit('play-sound',"goal");
        } 
        // this.ball.wallCollide();
        this.ballHolder = newHolder;
        
        for(let [key,player] of Object.entries(this.players)){
            player.update();
            player.wallCollide();
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
        let arr = Object.values(this.players);
        arr.sort((a,b)=>(a.y>b.y)? 1: -1);
        for(let key in arr){
            arr[key].display();
        }
    }
    updateClient(playerData,ballData){ // client side update called every clock cycle
        // const t0 = performance.now();
        Object.assign(this.ball,ballData);
        for(let key in playerData){
            if(!(key in this.players)){
                this.players[key] = new Player(key,0,0,C.playerRadius,playerData[key].username);
            }
            Object.assign(this.players[key],playerData[key]);
        }
        for(let key in this.players){
            if(!(key in playerData)){
                delete this.players[key];
            }
        }
        // const t1 = performance.now();
        // console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
    }
    serverSend(){ // sends data from server to client
        let playerData={};
        // console.log(Object.keys(this.players).length);
        for(let key in this.players){
            playerData[key] = this.players[key].getData();
        }
        // WHY is below code not working !!?
        // console.info(Object.entries);
        // for(let [key,value] in Object.entries(this.players)){
        //     console.log(key,value);
        //     // playerData[key] = value.getData();
        // }
        // console.info(playerData);
        io.in(this.roomName).emit("clock",{playerData:playerData,ballData:this.ball.getData()});
    }
    sendInitData(){ // send player teamnames to newly joined ppl
        let playerData={};
        for(let key in this.players){
            playerData[key] = this.players[key].getInitData();
        }
        let playerCount = Object.keys(this.players).length ;
        let initDict = {
            roomName:this.roomName,
            playerData:playerData,
            ballData:this.ball.getData(),
            isAdmin: (playerCount == 1),
        }; 
        io.in(this.roomName).emit("init",initDict);
    }
}
if (typeof module != "undefined"){
    module.exports = {
        Game: Game,
    }
}