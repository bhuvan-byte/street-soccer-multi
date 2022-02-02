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
        this.canTackle = true;
        this.mass=1;
        this.wall_e = 0;
        this.width = C.Width;
        this.height = C.Height;
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
        this.friction=0.9;
        this.exists=true;
        this.hasBall=false;
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
    wallCollide(){
        if(this.x-this.radius<0){ // left wall collision
            this.x=this.radius;
            this.vx *= -this.wall_e;
        }
        if(this.x+this.radius>C.Width){ // right wall collision
            this.x=C.Width -this.radius;
            this.vx *= -this.wall_e;
        }
        if(this.y-this.radius<0){ // top wall collision
            this.y= this.radius;
            this.vy *= -this.wall_e;
        }
        if(this.y+this.radius>C.Height) { // bottom wall collision
            this.y=C.Height -this.radius;
            this.vy *= -this.wall_e;
        }
    }
    changeTeam(team){
        this.teamName = team ?? this.teamName;
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
    reset(x,y){ // to send players in their halves in the begining or after a goal
        this.x = x*C.scaleFieldX; // remove this scaleFieldX,Y from player class and use it from constants 
        this.y = y*C.scaleFieldY;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
    }
    mouseSend(){
        sock.emit('mouse',{x:mouseX,y:mouseY});
    }
    multiplyAcc(factor){
        this.ax*=factor;
        this.ay*=factor;
    }
    moveHandler(ecode,direction){
        let acc=C.playerAcc ;
        if(this.hasBall) acc *= C.playerAccFac;
        this.pressed[ecode]=direction;
        this.ax=this.ay=0;
        if(this.pressed['KeyA']) this.ax-=acc;
        if(this.pressed['KeyW']) this.ay-=acc;
        if(this.pressed['KeyD']) this.ax+=acc;
        if(this.pressed['KeyS']) this.ay+=acc;
    }
    thetaHandler(mousex,mousey){
        this.theta = Math.atan2((mousey-this.y),(mousex-this.x));
    }
    joystickHandler(dxdy){
        let {dx,dy} = dxdy;
        let acc=C.playerAcc ;
        if(this.hasBall) acc *= C.playerAccFac;
        this.ax = this.ay = 0;
        this.ax += dx*acc;
        this.ay += dy*acc; 
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
            hasBall:this.hasBall,
            // color:this.color,
        };
    }
    getInitData(){
        // if later player characterisitcs are addded then this will be updated
        return {
            username:this.username,
            teamName:this.teamName,
        }
    }
}

global.Player = Player;
global.Entity = Entity;

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