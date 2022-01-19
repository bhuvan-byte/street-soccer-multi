class Ball extends Entity{
    constructor(){
        super(C.Width/2,C.Height/2,C.ballRadius); 
        this.img=undefined;
        this.clientInit();
    }
    clientInit(){
        this.img = ball_img;
        this.img.resize(2*this.radius,2*this.radius);
    }
    display(){
        // console.log("Ball display"); 
        let diameter = this.radius*2;
        let bigDiameter = C.ballBigRadius*2; 
        // ellipse(this.x,this.y,diameter,diameter);
        // ellipse(this.x,this.y,bigDiameter,bigDiameter);
        push();
        translate(this.x,this.y);
        this.spriteAng += this.vx/20 + Math.sign(this.vx)*Math.abs(this.vy)/40;
        rotate(this.spriteAng);
        imageMode(CENTER);
        image(this.img,0,0);
        pop();
    }
}