"use strict";
class Game{
    constructor(roomName){
        this.players = {};
        this.roomName = roomName;
        this.ready = false; // currently unused
        this.intervalId = null;
        this.ballHolder = null;
        this.ball = new Ball();
        this.started = false; // game started for the first time
        this.isRunning = false;
        // this.timer = new Stopwatch(300*1000);
        this.waitList = {};
        this.scoreA = 0;
        this.scoreB = 0;
        // this.curTime;
    }
    display(){ // client side function  
        this.ball.display();
        let arr = Object.values(this.players);
        arr.sort((a,b)=>(a.y>b.y)? 1: -1);
        for(let key in arr){
            arr[key].display();
        }
        // display score on canvas
        // textSize(20);
        // fill('#0000FF');
        // strokeWeight(1);
        // text(`A -> ${scoreAFrontEnd}`,5*C.scaleFieldX,19.5*C.scaleFieldY);
        // text(`B -> ${scoreBFrontEnd}`,20*C.scaleFieldX,19.5*C.scaleFieldY);
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
}