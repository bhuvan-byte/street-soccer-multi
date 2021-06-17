/// <reference path="./libraries/TSDef/p5.global-mode.d.ts" />
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
        this.xgap = 0;
        this.ygap = 0;
    }
    update(){
        this.x+=this.vx;
        this.y+=this.vy;
        if(this.x-this.radius  < this.xgap){
            this.x=this.radius+this.xgap;
            this.vx *= -this.wall_e;
        }
        if(this.x+this.radius>C.Width - this.xgap){
            this.x=C.Width -this.xgap-this.radius;
            this.vx *= -this.wall_e;
        }
        if(this.y <this.ygap + this.radius){
            this.y= this.ygap + this.radius;
            this.vy *= -this.wall_e;
        }
        if(this.y+this.radius>C.Height-this.ygap) {
            this.y=C.Height - this.ygap -this.radius;
            this.vy *= -this.wall_e;
        }
        this.vx+=this.ax;
        this.vy+=this.ay;
        this.vx*=this.friction;
        this.vy*=this.friction;
    }
}
class Player extends Entity{
    constructor(id,x,y,radius,isAdmin,username,sock){
        super(x,y,radius);
        this.id = id;
        this.sock=sock;
        // this.color= "#000";
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
    clientInit(){
        this.images = whitePlayerImgList;
        // this.C.animationSpeed = C.animationSpeed;
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
        image(this.images[index],this.x - C.picWidth*0.4, this.y - C.picHeight*0.7);
        this.index += C.animationSpeed* Math.sqrt(this.vx*this.vx + this.vy*this.vy);
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
        document.addEventListener('mousedown',(e)=>{
            sock.emit("shoot",{x:mouseX,y:mouseY});
        });
        document.addEventListener('keydown',(e)=>{
            if(!e.repeat && (e.code in this.pressed)){
                sock.emit("keypress",{ecode:e.code,direction:1});
                // this.moveHandler(e.code,1);
            }
        });
        document.addEventListener('keyup',(e)=>{
            if((e.code in this.pressed)){
                sock.emit("keypress",{ecode:e.code,direction:0});
                // this.moveHandler(e.code,0);
            }
        });
    }
    moveHandler(ecode,direction){
        const acc=C.playerAcc ;
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