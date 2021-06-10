    /// <reference path="./libraries/TSDef/p5.global-mode.d.ts" />
"use strict";
if(typeof module !="undefined"){
    global.Width = require("./constants.js").Width;
    global.Height = require("./constants.js").Height;
    global.playerAcc = require("./constants.js").playerAcc;
    console.log("Width=",Width);
}

// const { text } = require("express");
// const {Width,Height} = require("./constants");
try {
    console.log(Player);
} catch (error) {
    // console.log("error",error); // made only for debug
}
class Entity{
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.vx=-Math.random()*4;
        this.vy=Math.random()*5;
        this.ax=0;
        this.ay=0;
        this.radius=radius;
        this.friction=0.99;
        this.mass=1;
    }
    update(){
        this.x+=this.vx;
        this.y+=this.vy;
        if(this.x<this.radius) this.x=this.radius;
        if(this.x+this.radius>Width)this.x=Width-this.radius;
        if(this.y<this.radius)this.y=this.radius;
        if(this.y+this.radius>Height)this.y=Height-this.radius;
        this.vx+=this.ax;
        this.vy+=this.ay;
        this.vx*=this.friction;
        this.vy*=this.friction;
    }
}
class Player extends Entity{
    constructor(playerNo,x,y,radius,isAdmin,username,sock){
        super(x,y,radius);
        this.sock=sock;
        // this.color= "#000";
        this.strokeColor="rgba(255,255,255,0.6)";
        this.d = 2*radius;
        this.theta = 0;
        this.username=username ?? "stillUnamed";
        this.friction=0.9;
        this.exists=true;
        this.teamName="notYetDecided";
        this.animationIndex = 0; // denotes the direction movement
        this.index = 0; // deontes number of image in that animation 
        this.pressed={
            'KeyA':0,
            'KeyW':0,
            'KeyD':0,
            'KeyS':0
        };
        if(typeof module === "undefined") this.clientInit(); 
    }
    clientInit(){
        this.images = whitePlayerImgList;
        this.animationSpeed = animationSpeed;
    }
    changeTeam(team){
        if(team == "A"){
            this.images = redPlayerImgList;
        }else if(team == "B"){
            this.images = bluePlayerImgList;
        }else {
            this.images = whitePlayerImgList;
            return;
        }
        this.teamName = team;
    }
    display(){
        if(this.ax==0 && this.ay ==0 ){
            this.animationIndex = 12;
        } else if(this.ax==0){
            if(this.ay<0){
                this.animationIndex = 9;
            } else if(this.ay>0){
                this.animationIndex = 6;
            }
        } else {
            if(this.ax>=0){
                this.animationIndex = 3;
            } else{
                this.animationIndex = 0;
            }
        }
        this.areaDisplay();
        // console.log(`speed: ${this.vx}, ${this.vy}, acc : ${this.ax},${this.ay}`);
        let index = floor(this.index)%3+this.animationIndex;
        image(this.images[index],this.x - picWidth*0.4, this.y - picHeight*0.7);
        this.index += this.animationSpeed* Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    }
    areaDisplay(){
        fill("rgba(255,255,255,0)");
        stroke(this.strokeColor);
        ellipse(this.x,this.y,this.d,this.d); // circle representing player
       
        stroke(this.strokeColor); // white color to draw shapes
        textSize(20);
        fill("#FFF");
        strokeWeight(1);
        textAlign(CENTER);
        textFont('Georgia');
        text(this.username,this.x,this.y+2*this.radius);
        // this.theta=atan2((mouseY-this.y),(mouseX-this.x));
        // this.vx=this.v*Math.cos(this.theta);
        // this.vy=this.v*Math.sin(this.theta); 
        // fill("#FFF");
        // strokeWeight(2);
        // line(this.x,this.y,this.x+this.radius*Math.cos(this.theta),this.y+this.radius*Math.sin(this.theta)); // line showing  the dirction where player is pointing
    }
    collide (ball2){
        let dx=ball2.x-this.x,
			dy=ball2.y-this.y,
			radSum=ball2.radius+this.radius;
            // console.log(`r1 = ${ball2.radius}, r2 = ${this.radius}`);
		if(dx*dx + dy*dy< radSum*radSum){
			let dist=Math.sqrt(dx*dx + dy*dy),
				dif=radSum-dist;
			dx/=dist;
			dy/=dist;
			let dot=dx*this.vx+dy*this.vy,
				dot2=dx*ball2.vx+dy*ball2.vy,
				impulsex=(dot-dot2)*dx,
				impulsey=(dot-dot2)*dy;
			//console.log(dot,dot2,impulsex,impulsey);
			this.vx-=impulsex;
			this.vy-=impulsey;
			ball2.vx+=impulsex;
			ball2.vy+=impulsey;
			this.x-=dif*dx;
			this.y-=dif*dy;
			ball2.x+=dif*dx;
			ball2.y+=dif*dy;
			this.dx+=dif*dx/2;
			this.dy+=dif*dy/2;
			//if(this.radius>10)this.radius-=5;
        }
    }
    mouseSend(){
        sock.emit('mouse',{x:mouseX,y:mouseY});
    }
    client(){
        document.addEventListener('keydown',(e)=>{
            if(!e.repeat && (e.code in this.pressed)){
                sock.emit("update",{ecode:e.code,direction:1});
                // this.moveHandler(e.code,1);
            }
        });
        document.addEventListener('keyup',(e)=>{
            if((e.code in this.pressed)){
                sock.emit("update",{ecode:e.code,direction:0});
                // this.moveHandler(e.code,0);
            }
        });
    }
    moveHandler(ecode,direction){
        const acc=playerAcc ;
        this.pressed[ecode]=direction;
        this.ax=this.ay=0
        if(this.pressed['KeyA']) this.ax-=acc;
        if(this.pressed['KeyW']) this.ay-=acc;
        if(this.pressed['KeyD']) this.ax+=acc;
        if(this.pressed['KeyS']) this.ay+=acc;
    }
    thetaHandler(mousex,mousey){
        this.theta = Math.atan2((mousey-this.y),(mousex-this.x));
    }
    getData(){
        return {
            x:this.x,
            y:this.y,
            vx:this.vx,
            vy:this.vy,
            ax:this.ax,
            ay:this.ay,
            theta:this.theta,
            username:this.username,
            teamName:this.teamName,
            // color:this.color,
        };
    }
}

if(typeof module != "undefined"){
    module.exports = {
        Player:Player,
        Entity:Entity,
    }
}
// class Player{
//     constructor(playerNo,R,G,B,x,y,d,theta,isAdmin){
//         this.playerNo=playerNo;
//         this.R=R;
//         this.G=G;
//         this.B=B;
//         this.x=x;
//         this.y=y;
//         this.d=d;
//         this.dx=0;
//         this.dy=0;
//         this.r=this.d/2;
//         this.theta=0;
//         this.centreX=this.x+this.r;
//         this.centreY=this.y+this.r;
//         this.v=3; 
//         this.vx=this.v*Math.cos(this.theta);
//         this.vy=this.v*Math.sin(this.theta); 
//         this.isAdmin = isAdmin;     
//     }
//     display(){
//         fill("#F00")
//         ellipse(this.centreX,this.centreY,this.d,this.d); // circle representing player
//         stroke(255, 255, 255); // white color to draw shapes

//         this.theta=atan2((mouseY-this.centreY),(mouseX-this.centreX));
//         this.vx=this.v*Math.cos(this.theta);
//         this.vy=this.v*Math.sin(this.theta); 
//         line(this.centreX,this.centreY,this.centreX+this.r*Math.cos(this.theta),this.centreY+this.r*Math.sin(this.theta)); // line showing  the dirction where player is pointing
    
//         // if(keyIsDown(UP_ARROW)){ // arrow keys for polar movement
//         //     this.x+=this.vx;
//         //     this.y+=this.vy;
//         // } 
//         // if(keyIsDown(DOWN_ARROW)){
//         //     this.x-=this.vx;
//         //     this.y-=this.vy;
//         // } 
//         // if(keyIsDown(LEFT_ARROW)){
//         //     this.x-=this.vy;
//         //     this.y+=this.vx;
//         // }
//         // if(keyIsDown(RIGHT_ARROW)){
//         //     this.x+=this.vy;
//         //     this.y-=this.vx;
//         // }            

//         // if(keyIsDown(87)){//w // wasd for  linear movement
//         //     this.y-=this.v;
//         // } 
//         // if(keyIsDown(83)){//s
//         //     this.y+=this.v;
//         // }
//         // if(keyIsDown(65)){//a
//         //     this.x-=this.v;
//         // }
//         // if(keyIsDown(68)){//d
//         //     this.x+=this.v;
//         // }

//         // if(this.x<0) this.x=0; // boundary collisions
//         // if(this.y<0) this.y=0;
//         // if(this.x+this.d>Width) this.x=Width-this.d;
//         // if(this.y+this.d>Height) this.y=Height-this.d;

//         // this.centreX=this.x+this.r; // recaclulating center coordinates
//         // this.centreY=this.y+this.r;
        
        
        
        
        
//     }

// }