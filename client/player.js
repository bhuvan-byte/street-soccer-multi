// / <reference path="./libraries/TSDef/p5.global-mode.d.ts" />
"use strict";
try {
    console.log(Player);
} catch (error) {
    console.log("error",error);
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
        this.color='#000';
    }
    update(){
        this.x+=this.vx;
        this.y+=this.vy;
        this.vx+=this.ax;
        this.vy+=this.ay;
        this.vx*=this.friction;
        this.vy*=this.friction;
    }
}
class Player extends Entity{
    constructor(playerNo,x,y,radius,isAdmin,sock){
        super(x,y,radius);
        this.sock=sock;
        this.d = 2*radius;
        this.theta = 0;
        this.username=null ?? "stillUnamed";
        this.friction=0.9;
        this.exists=true;
        this.pressed={
            'KeyA':0,
            'KeyW':0,
            'KeyD':0,
            'KeyS':0
        };
    }
    display(){
        fill("#F00")
        ellipse(this.x,this.y,this.d,this.d); // circle representing player
        stroke(255, 255, 255); // white color to draw shapes

        this.theta=atan2((mouseY-this.y),(mouseX-this.x));
        this.vx=this.v*Math.cos(this.theta);
        this.vy=this.v*Math.sin(this.theta); 
        line(this.x,this.y,this.x+this.radius*Math.cos(this.theta),this.y+this.radius*Math.sin(this.theta)); // line showing  the dirction where player is pointing
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
        const acc=0.8 ;
        this.pressed[ecode]=direction;
        this.ax=this.ay=0
        if(this.pressed['KeyA']) this.ax-=acc;
        if(this.pressed['KeyW']) this.ay-=acc;
        if(this.pressed['KeyD']) this.ax+=acc;
        if(this.pressed['KeyS']) this.ay+=acc;
    }
    getData(){
        return {
            x:this.x,
            y:this.y,
            vx:this.vx,
            vy:this.vy,
            ax:this.ax,
            ay:this.ay,
        };
    }
}
if(typeof module != "undefined"){
    module.exports = {
        Player:Player,
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