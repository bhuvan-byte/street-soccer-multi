// const { ballRadius } = require("./constants.js");

// const { Width, Height } = require("./constants.js");

if(typeof module !="undefined"){
    Width = require("./constants.js").Width;
    Height = require("./constants.js").Height;
    ballRadius = require("./constants.js").ballRadius;
}
class Ball extends Entity{
    constructor(){
        super(Width/2,Height/2,ballRadius); 
        this.player = 0;
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
		if(dx*dx + dy*dy< radSum*radSum){
			return true;
        }
    }
    updateFollow(player){
        this.x = player.x+player.radius;
        this.y = player.y;
    }
    display(){
        // console.log("Ball display"); 
        let diameter = this.radius*2;
        ellipse(this.x,this.y,diameter,diameter);
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