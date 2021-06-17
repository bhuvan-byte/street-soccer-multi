class Ball extends Entity{
    constructor(){
        super(C.Width/2,C.Height/2,C.ballRadius); 
        this.player = 0;
        this.friction = 0.96;
        this.wall_e = 1;
        this.xgap = C.xgap;
        this.ygap = C.ygap;
        if(typeof module == "undefined") this.clientInit();
    }
    clientInit(){
        this.img = ball_img;
        this.img.resize(2*this.radius,2*this.radius);
    }
    isCollide(player){
        let dx=player.x-this.x,
			dy=player.y-this.y,
			radSum=player.radius+C.ballBigRadius;
            // console.log(`r1 = ${player.radius}, r2 = ${this.radius}`);
		return (dx*dx + dy*dy< radSum*radSum);

    }
    updateFollow(player){
        // if(player.ax!=0 || player.ay!=0) player.ballDir = Math.atan2(player.ax,player.ay);
        let moveDir = Math.atan2(player.vy,player.vx);
        let ratio = Math.sqrt(player.vx*player.vx+player.vy*player.vy)/3 ; // hardcoded
        player.ballDir = ratio*moveDir + (1-ratio)*player.theta;
        let dist = player.radius + this.radius -2;
        const pi = Math.PI;
        let diff = player.ballDir - (-pi/2);
        // console.log(diff);
        if(Math.abs(diff)<pi/4) player.ballDir = -pi/2 + Math.sign(diff)*pi/4;    
        this.x = player.x+dist*Math.cos(player.ballDir);
        this.y = player.y+dist*Math.sin(player.ballDir);
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
    global.Ball = Ball;
}