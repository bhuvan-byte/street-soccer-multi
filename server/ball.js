/** collision with ball1 fixed 
 * @param {Entity} ball1 @param {Entity} ball2*/
function collide2 (ball1,ball2){
    let dx=ball2.x-ball1.x,
        dy=ball2.y-ball1.y,
        radSum=ball2.radius+ball1.radius;
        // console.log(`r1 = ${ball2.radius}, r2 = ${ball1.radius}`);
    if(dx*dx + dy*dy< radSum*radSum){
        let dist=Math.sqrt(dx*dx + dy*dy),
            dif=radSum-dist;
        dx/=dist;
        dy/=dist;
        let dot=dx*ball1.vx+dy*ball1.vy,
            dot2=dx*ball2.vx+dy*ball2.vy,
            impulsex=(dot-dot2)*dx,
            impulsey=(dot-dot2)*dy;
        ball2.vx+=2*impulsex;
        ball2.vy+=2*impulsey;
        ball2.x+=dif*dx;
        ball2.y+=dif*dy;
        //if(ball1.radius>10)ball1.radius-=5;
    }
}
class Ball extends Entity{
    constructor(){
        super(C.Width/2,C.Height/2,C.ballRadius); 
        this.player = 0;
        this.friction = 0.96;
        this.xgap = C.xgap;
        this.ygap = C.ygap;
        this.spriteAng = 0;
        this.poles = [
            new Entity(C.xGoalGap+C.goalW,C.Height / 2 - C.goalH / 2,C.goalPoleRad),
            new Entity(C.xGoalGap+C.goalW,C.Height / 2 + C.goalH / 2,C.goalPoleRad),
            new Entity(C.Width - C.xgap, C.Height / 2 - C.goalH / 2, C.goalPoleRad),
            new Entity(C.Width - C.xgap, C.Height / 2 + C.goalH / 2, C.goalPoleRad),
        ];
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
                // this.reset();
                // goal made in court of teamA. teamA will start next round
                if(this.x<this.xgap) return "A";
            } else{
                this.x=this.radius+this.xgap;
                this.vx *= -wall_e;
            }           
        }
        if(this.x+this.radius>C.Width-this.xgap){ // right wall collision
            if(this.y>=C.Height/2-C.goalH/2 && this.y<=C.Height/2+C.goalH/2){ // check for goal
                // this.reset();
                // goal made in court of teamB. teamB will start next round
                if(this.x>C.Width-this.xgap) return "B";
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
        for(const pole of this.poles){
            collide2(pole,this);
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
    goalCollide(){
        function collideLineBall(x1,y1,x2,y2,dir,ball,e=0.2){
            if(x1 == x2 && Math.abs(ball.x-x1)<ball.radius){
                if(y1>y2) [y1,y2] = [y2,y1];
                ball.x = x1 + dir*ball.radius;
                ball.vx *= -1*e;
            }else if(y1==y2 && Math.abs(ball.y-y1)<ball.radius){
                if(x1>x2) [x1,x2] = [x2,x1];
                ball.y = y1 + dir*ball.radius;
                ball.vy *= -1*e;
            }
        }
        
        // left vertical
        collideLineBall(C.xGoalGap, C.Height/2 - C.goalH/2,
            C.xGoalGap,C.Height/2 + C.goalH/2,
            1,this);
        // left up
        collideLineBall(C.xGoalGap, C.Height/2 - C.goalH/2,
            C.xgap, C.Height/2 - C.goalH/2,
            +1,this);
        //left down
        collideLineBall(C.xGoalGap, C.Height/2 + C.goalH/2,
            C.xgap, C.Height/2 + C.goalH/2,
            -1,this);
        

        // right vertical
        collideLineBall(C.Width-C.xGoalGap, C.Height/2 - C.goalH/2,
            C.Width-C.xGoalGap,C.Height/2 + C.goalH/2,
            -1,this);
        // right up
        collideLineBall(C.Width-C.xGoalGap, C.Height/2 - C.goalH/2,
            C.Width-C.xgap, C.Height/2 - C.goalH/2,
            +1,this);
        //right down
        collideLineBall(C.Width-C.xGoalGap, C.Height/2 + C.goalH/2,
            C.Width-C.xgap, C.Height/2 + C.goalH/2,
            -1,this);
        // for(const pole of this.poles){
        //     collide2(pole,this);
        // }
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