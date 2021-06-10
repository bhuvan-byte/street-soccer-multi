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
        this.player = null;
        if(typeof module == "undefined") this.clientInit();
    }
    clientInit(){
        this.img = ball_img;
        this.img.resize(this.radius,this.radius);
    }
    display(){
        // console.log("Ball display"); 
        image(this.img,this.x-this.radius/2,this.y-this.radius/2,this.radius,this.radius);
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