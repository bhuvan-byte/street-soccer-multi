"use strict";
const GameState = {
    PAUSE:0,
    PLAY:1
}
class Game{
    constructor(roomName){
        this.players = {};
        this.roomName = roomName;
        this.ready = false; // currently unused
        this.intervalId = null;
        this.intervalIdStop = null;
        this.ballHolder = null;
        this.ball = new Ball();
        this.started = false; // game started for the first time
        this.isRunning = false;
        this.timer = new Stopwatch(C.gametime);
        this.waitList = {};
        this.scoreA = 0;
        this.scoreB = 0;
        // this.curTime;
    }
    run(){
        // this.isRunning = true;
        clearInterval(this.intervalId); 
        this.intervalId = setInterval(() => {
            this.update();
            this.serverSend();
        }, 16);
        this.sendTime(); //start emitting time left at 1 second interval 
    }
    start(){
        this.allotTeams();
        if(!this.started) this.reset();
        this.started = true;
        io.in(this.roomName).emit("countDown",C.countDown);
        setTimeout(() => {
            this.isRunning = true;
            this.timer.start();
        }, C.countDown);
    }
    allotTeams(){
        // count all three types of players teamA,teamB,notYetDecided 
        let teamACount=0;
        let teamBCount=0;
        let noTeamCount=0;
        for(let key in this.players){
            if(this.players[key].teamName == "A"){
                teamACount++;
            } else if(this.players[key].teamName == "B"){
                teamBCount++;
            } else{
                noTeamCount++;
            }
        }
        // total = ateam + bteam + noteam. // target: to divide in two teams of same size as nearly as possible
        let totalPpl = (teamACount + teamBCount + noTeamCount);
        let teamAFinalSize,teamBFinalSize; 
        if(teamACount >= teamBCount){ // if teamA hasa more ppl then lets start by deciding finl size of teamA which would be either its current size or half of total ppl whichever is more
            teamAFinalSize = Math.max(teamACount,Math.floor(totalPpl/2));
            teamBFinalSize = totalPpl - teamAFinalSize;
        } else{
            teamBFinalSize = Math.max(teamBCount,Math.floor(totalPpl/2));
            teamAFinalSize = totalPpl - teamBFinalSize;
        }
        // console.log(`tc->${totalPpl},tc/2->${Math.floor(totalPpl/2)}`);
        // console.log(`a->${teamACount}, fa->${teamAFinalSize}`);
        // console.log(`b->${teamBCount}, fb->${teamBFinalSize}`);
        let left_ptr = 0;
        let right_ptr = 0; // these are indexes to refer to array of formations and locate a player
        for(let key in this.players){
            if(this.players[key].teamName == "notYetDecided"){ // assign team as per need //  hope that this need does not arrise and players select team themselves 
                if(teamAFinalSize>teamACount){ // there is space in teamA for this guy
                    io.in(this.roomName).emit("changeTeam",{id:key,team:"A"});
                    this.players[key].teamName = "A";
                    teamACount++;
                } else{
                    io.in(this.roomName).emit("changeTeam",{id:key,team:"B"});
                    this.players[key].teamName = "B";
                    teamBCount++;
                }
            }
        }
    }
    reset(startTeam){ // server side function
        // reset ball + all players
        // console.log(`start team -> ${startTeam}`);
        startTeam = startTeam ?? "B";
        this.ball.reset();   
        let startPlayer = 0; // set this 1 when the player is assigned centre spot
        let left_ptr = 0;
        let right_ptr = 0; // these are indexes to refer to array of formations and locate a player
        for(let key in this.players){
            if(this.players[key].teamName == "A"){ // team on left side
                if(startTeam=="A" && startPlayer == 0 ){
                    this.players[key].reset(20,10);
                    startPlayer = 1;
                } else{
                    this.players[key].reset(basic_formation.teamL[left_ptr].x,basic_formation.teamL[left_ptr].y);
                    left_ptr++;
                }                
            } else if(this.players[key].teamName == "B"){ // team on right side
                if(startTeam=="B" && startPlayer == 0 ){
                    this.players[key].reset(20,10);
                    startPlayer = 1;
                } else{
                   
                    this.players[key].reset(basic_formation.teamR[right_ptr].x,basic_formation.teamR[right_ptr].y);
                    right_ptr++;
                }
            } else{ // assign team as per need //  hope that this need does not arrise and players select team themselves 
               console.log(`team not alloted u should not be here. fix the bugs`);
            }
        }
    }
    sendTime(){
        clearInterval(this.intervalIdStop);
        this.intervalIdStop = setInterval(() => {
            let timeLeft = this.timer.getMilliseconds()/1000;
            io.in(this.roomName).emit('timeLeft',timeLeft);
            if(timeLeft<=1){
                // Complete Game Restart
                this.isRunning = false;
                this.timer.reset();
                this.started = false;
                this.clearWaitList();
            } 
        }, 1000);
        // Date.
    }
    addPlayer(id,username){
        let player = new Player(id,Math.random()*C.Width,Math.random()*C.Height,C.playerRadius,false,username);
        // if(!this.started) 
        let numA=0,numB=0;
        for(const key in this.players){
            if(this.players[key].teamName=='A') numA+=1;
        }
        numB = Object.keys(this.players).length-numA;
        player.teamName = (numA>numB) ? "B":"A";
        this.players[id] = player;
        // else this.waitList[id] = player;
    }
    clearWaitList(){
        for(let key in this.waitList){
            this.players[key] = this.waitList[key];
        }
        this.sendInitData();
        this.waitList={};
    }
    shoot(mouse,id){ // called from websocket.js
        if(!this.isRunning) return ;
        this.players[id].thetaHandler(mouse.x,mouse.y);
        let canShoot = this.ball.isCollide(this.players[id]);
        if(canShoot){
            // this.ballHolder = null; 
            let theta = this.players[id].theta;
            // radSum is 1 unit bigger so that ball does not follow the same player again
            let radSum =1+ C.playerRadius + C.ballBigRadius;
            this.ball.x = this.players[id].x + Math.cos(theta)*radSum; // to change playerRad
            this.ball.y = this.players[id].y + Math.sin(theta)*radSum;
            this.ball.vx = this.players[id].vx + Math.cos(theta)*C.shootSpeed;
            this.ball.vy = this.players[id].vy + Math.sin(theta)*C.shootSpeed;
            io.in(this.roomName).emit('play-sound',"kick");
        }
    }
    ballUpdate(){ //server side function
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
        // console.log(this.ballHolder,newHolder);
        try{
            if(newHolder != this.ballHolder){
                if(this.ballHolder){
                    this.players[this.ballHolder].multiplyAcc(1/C.playerAccFac);
                    // console.log(`increasing acc of ${this.ballHolder}`);
                }
                if(newHolder){
                    this.players[newHolder].multiplyAcc(C.playerAccFac);
                    // console.log(`decreasing acc of ${newHolder}`);
                }
            }
        }catch(err){
            console.log(`Fix ${err}`);
        }
        if(isGoal){ // ALERT isGoal represents the court in which goal was scored and not the team which scored the goal
            if(isGoal == "A"){ // hence increase score of b if isGoal = "A"
                this.scoreB++;
            } else{
                this.scoreA++;
            } 
            io.in(this.roomName).emit('score',{scoreA:this.scoreA,scoreB:this.scoreB});
            io.in(this.roomName).emit('play-sound',"goal");
            this.isRunning = false;
            this.timer.stop();
            setTimeout(() => {
                this.reset(isGoal);
                this.start();
            }, 5000);
        } 
        // this.ball.wallCollide();
        this.ballHolder = newHolder;
    }
    update(){ // server side update
        if(this.isRunning) this.ballUpdate();
        else {this.ball.update();this.ball.goalCollide()}
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
    tackle(sockid){
        const p = this.players[sockid];
        const dy = this.ball.y-p.y;
        const dx = this.ball.x-p.x;
        if(dx*dx + dy*dy > C.tackleDist*C.tackleDist) return;
        if(!this.ballHolder || p.hasBall || !p.canTackle) return;
        p.canTackle = false;
        setTimeout(()=>p.canTackle = true,C.tackleCooldown); 
        const theta = Math.atan2(dy,dx);
        p.vx = C.tackleSpeed*Math.cos(theta);
        p.vy = C.tackleSpeed*Math.sin(theta);
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
        // BUG: Client setup function runs each time a new player joins !!
        io.in(this.roomName).emit("clock",initDict);
    }
    resetScores(){
        this.scoreA = 0;
        this.scoreB = 0;
    }
}
module.exports = {
    Game: Game,
}
