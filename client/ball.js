class Ball extends Entity{
    constructor(){
        super(C.Width/2,C.Height/2,C.ballRadius); 
        this.player = 0;
        this.friction = 0.96;
        this.xgap = C.xgap;
        this.ygap = C.ygap;
        this.spriteAng = 0;
        if(typeof module == "undefined") this.clientInit();
    }
    clientInit(){
        this.img = ball_img;
        this.img.resize(2*this.radius,2*this.radius);
    }
    reset(){
        this.x = C.Width/2;
        this.y = C.Height/2;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
    }
    wallCollide(wall_e){ //server side
        if(this.x-this.radius<this.xgap){ // left wall collision
            if(this.y>=C.Height/2-C.goalH/2 && this.y<=C.Height/2+C.goalH/2){ // check for goal
                this.reset();
                return true;
            } else{
                this.x=this.radius+this.xgap;
                this.vx *= -wall_e;
            }           
        }
        if(this.x+this.radius>C.Width-this.xgap){ // right wall collision
            if(this.y>=C.Height/2-C.goalH/2 && this.y<=C.Height/2+C.goalH/2){ // check for goal
                this.reset();
                return true;
            }else{
                this.x=C.Width -this.xgap-this.radius;
                this.vx *= -wall_e;
            }           
        }
        if(this.y-this.radius<this.ygap){ // top wall collision
            this.y= this.ygap + this.radius;
            this.vy *= -wall_e;
        }
        if(this.y+this.radius>C.Height-this.ygap) { // bottom wall collision
            this.y=C.Height - this.ygap -this.radius;
            this.vy *= -wall_e;
        }
        return false;
    }
    isCollide(player){
        let dx=player.x-this.x,
			dy=player.y-this.y,
			radSum=player.radius+C.ballBigRadius;
            // console.log(`r1 = ${player.radius}, r2 = ${this.radius}`);
		return (dx*dx + dy*dy< radSum*radSum);
    }
    updateFollow(player){ //server side
        // if(player.ax!=0 || player.ay!=0) player.ballDir = Math.atan2(player.ax,player.ay);
        let moveDir = Math.atan2(player.vy,player.vx);
        let ratio = Math.min(1,player.getVel()/3) ; // hardcoded
        let c1 = ratio*moveDir + (1-ratio)*player.theta;
        let c2 = ratio;
        player.ballDir = c1;
        let dist = player.radius + this.radius -2;
        const pi = Math.PI;
        let diff = player.ballDir - (-pi/2);
        // console.log(diff);
        if(Math.abs(diff)<pi/5) player.ballDir = -pi/2 + Math.sign(diff)*pi/5;    
        this.x = player.x+dist*Math.cos(player.ballDir);
        this.y = player.y+dist*Math.sin(player.ballDir);
        this.vx = player.vx;
        this.vy = player.vy;
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