/// <reference path="../libraries/TSDef/p5.global-mode.d.ts" />
"use strict";

class Entity{
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.vx=0;
        this.vy=0;
        this.ax=0;
        this.ay=0;
        this.radius=radius;
        this.friction=0.99;
        this.mass=1;
        this.wall_e = 0;
        this.width = C.Width;
        this.height = C.Height;
        this.zeroSent = 0;
    }
    update(){ // used by player and ball. gap values different for them
        this.x+=this.vx;
        this.y+=this.vy;
        this.vx+=this.ax;
        this.vy+=this.ay;
        this.vx*=this.friction;
        this.vy*=this.friction;
    }
    getVel(){
        return Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    }
}
class Player extends Entity{
    constructor(id,x,y,radius,isAdmin,username){
        super(x,y,radius);
        this.id = id;
        this.strokeColor="rgba(255,255,255,0.6)";
        this.d = 2*radius;
        this.theta = 0;
        this.ballDir = 0;
        this.username=username ?? "stillUnamed";
        this.teamName="notYetDecided";
        this.animationIndex = 0; // denotes the direction movement
        this.index = 0; // deontes number of image in that animation 
        this.images = undefined;
        this.clientInit();
    }
    clientInit(whitePlayerImgList__){
        this.images = whitePlayerImgList;
        // this.C.animationSpeed = C.animationSpeed;
    }
    changeTeam(team){
        team = team ?? this.teamName;
        if(team == "A"){
            this.images = bluePlayerImgList;
        }else if(team == "B"){
            this.images = redPlayerImgList;
        }else {
            this.images = whitePlayerImgList;
            return;
        }
        this.teamName = team;
    }
    display(){ // (called from index.js)
        push(); // necessary to save p5 state then restore with pop()
        if(this.ax==0 && this.ay ==0 ){
            // this.animationIndex = 12;
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
        if(this.hasBall) this.highlightDisplay();
        // console.log(`speed: ${this.vx}, ${this.vy}, acc : ${this.ax},${this.ay}`);
        let index = this.animationIndex;
        index += (this.ax==0 && this.ay==0) ? 0: floor(this.index)%3;
        image(this.images[index],this.x - C.picWidth*0.4, this.y - C.picHeight*0.7);
        this.index += C.animationSpeed* Math.sqrt(this.vx*this.vx + this.vy*this.vy);
        pop();
    }
    areaDisplay(){ // (called from index.js)
        fill("rgba(255,255,255,0)");
        stroke(this.strokeColor);
        ellipse(this.x,this.y,this.d,this.d); // circle representing player
       
        stroke(this.strokeColor); // white color to draw shapes
        textSize(15);
        textFont(openSans);
        fill("#FFF");
        strokeWeight(1);
        textAlign(CENTER);
        text(this.username,this.x,this.y-2.5*this.radius);
        // this.theta=atan2((mouseY-this.y),(mouseX-this.x));
        // this.vx=this.v*Math.cos(this.theta);
        // this.vy=this.v*Math.sin(this.theta); 
        // fill("#FFF");
        // strokeWeight(2);
        // line(this.x,this.y,this.x+this.radius*Math.cos(this.theta),this.y+this.radius*Math.sin(this.theta)); // line showing  the dirction where player is pointing
    }
    highlightDisplay(){ // to highlight the player who is in possesion of the ball (called from index.js)
        let d1 = 45; // height of lower point of triangle
        let d2 = 55; // height of two upper points to make a downward pointing traingle
        let twidth = 10; // width of top base of triangle
        fill('#088da5bb');
        triangle(this.x,this.y-d1,this.x-twidth,this.y-d2,this.x+twidth,this.y-d2); // needs 3 points (x,y)
        // ellipse(this.x+200*Math.cos(this.theta),this.y+200*sin(this.theta),5,5);
        // line(this.x,this.y,this.x+200*Math.cos(this.theta),this.y+200*sin(this.theta));
        fill("rgba(255,255,255,0)");
     

    }
    // mouseSend(){
    //     // sock.emit('mouse',{x:mouseX,y:mouseY});
    // }
    joystickSend(){
        let dx = joystick.deltaX();
        let dy = joystick.deltaY();
        let d = Math.sqrt(dx*dx + dy*dy);
        //  Alert hardcoded values inner=20, outer=40;
        if(d <= 5){
            if(this.zeroSent != 1){
                // this only sends data once to set the velocity of player to 0.
                this.zeroSent = 1;
                sock.emit('joystick',{dx:0,dy:0});
            }
        } else{
            d = d/(Math.log1p(d/5)/Math.log1p(40/5));
            sock.emit('joystick',{dx:dx/d,dy:dy/d});
            this.zeroSent = 0;
        }
    }
    shootingSend(){
        // for mobiles
        // console.log('mobile-shoot sent')
        let dx = shootingBtn.deltaX();
        let dy = shootingBtn.deltaY();
        let d = Math.sqrt(dx*dx+dy*dy);
        let fac = 1000;
        if(d<=10) return;
        if(d == 0){
            if(this.zeroSent != 1){
                // this only sends data once to set the velocity of player to 0.
                this.zeroSent = 1;
                // sock.emit('shoot',{x:0,y:0});
            }
        } else{
            sock.emit('shoot',{x:fac*dx/d+this.x,y:fac*dy/d+this.y});
            this.zeroSent = 0;
        }
    }
}

if(typeof module != "undefined"){
    global.Player = Player;
    global.Entity = Entity;
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
//         // if(this.x+this.d>C.Width) this.x=C.Width-this.d;
//         // if(this.y+this.d>C.Height) this.y=C.Height-this.d;

//         // this.centreX=this.x+this.r; // recaclulating center coordinates
//         // this.centreY=this.y+this.r;
        
        
        
        
        
//     }

// }