// const { C.ballRadius } = require("./constants.js");

// const { C.Width, C.Height } = require("./constants.js");

if(typeof module !="undefined"){
    global.Entity = require("./player").Entity;
    // C.Width = require("./constants.js").C.Width;
    // C.Height = require("./constants.js").C.Height;
    // C.ballRadius = require("./constants.js").C.ballRadius;
}

class Ball extends Entity{
    constructor(){
        super(C.Width/2,C.Height/2,C.ballRadius); 
        this.player = 0;
        this.friction = 0.96;
        if(typeof module == "undefined") this.clientInit();
    }
    clientInit(){
        this.img = ball_img;
        this.img.resize(2*this.radius,2*this.radius);
    }
    isCollide(player){
        let dx=player.x-this.x,
			dy=player.y-this.y,
			radSum=player.radius+this.radius;
            // console.log(`r1 = ${player.radius}, r2 = ${this.radius}`);
		return (dx*dx + dy*dy< radSum*radSum);

    }
    updateFollow(player){
        // if(player.ax!=0 || player.ay!=0) player.moveDir = Math.atan2(player.ax,player.ay);
        player.moveDir = Math.atan2(player.vx,player.vy);
        let dist = player.radius + this.radius -5;
        this.x = player.x+dist*Math.sin(player.moveDir);
        this.y = player.y+dist*Math.cos(player.moveDir);
        this.vx = player.vx;
        this.vy = player.vy;
    }
    display(){
        // console.log("Ball display"); 
        let diameter = this.radius*2;
        let bigDiameter = C.ballBigRadius*2; 
        ellipse(this.x,this.y,diameter,diameter);
        ellipse(this.x,this.y,bigDiameter,bigDiameter);
        imageMode(CENTER);
        image(this.img,this.x,this.y);
        imageMode(CORNER);
    }
    getData(){
        return {
            x:this.x,
            y:this.y,
            vx:this.vx,
            vy:this.vy,
            ax:this.ax,
            ay:this.ay,
            player:this.player,
        };
    }
}

if(typeof module != "undefined"){
    module.exports = {
        Ball:Ball,
    }
}