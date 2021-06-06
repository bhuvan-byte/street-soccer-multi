// const { ballRadius } = require("./constants.js");

// const { Width, Height } = require("./constants.js");

if(typeof module !="undefined"){
    Width = require("./constants.js").Width;
    Height = require("./constants.js").Height;
    ballRadius = require("./constants.js").ballRadius;
}
class Ball extends Entity{
    constructor(img){
        super(Width/2,Height/2,ballRadius); 
        this.img = img;
        this.img.resize(this.radius,this.radius);
    }
    display(){
        // console.log("Ball display"); dafd
        image(this.img,this.x-this.radius/2,this.y-this.radius/2,this.radius,this.radius);
    }
}