class Player{
    constructor(R,G,B,x,y,d,theta){
        this.R=R;
        this.G=G;
        this.B=B;
        this.x=x;
        this.y=y;
        this.d=d;
        this.dx=0;
        this.dy=0;
        this.r=this.d/2;
        this.theta=theta;
        this.centreX=this.x+this.r;
        this.centreY=this.y+this.r;
        this.v=3; 
        this.vx=this.v*cos(this.theta);
        this.vy=this.v*sin(this.theta);      
    }
    display(){
        fill(this.R,this.G,this.B)
        ellipse(this.centreX,this.centreY,this.d,this.d); // circle representing player
        stroke(255, 255, 255); // white color to draw shapes

        this.theta=atan2((mouseY-this.centreY),(mouseX-this.centreX));
        this.vx=this.v*cos(this.theta);
        this.vy=this.v*sin(this.theta); 
        line(this.centreX,this.centreY,this.centreX+this.r*cos(this.theta),this.centreY+this.r*sin(this.theta)); // line showing  the dirction where player is pointing
    
        if(keyIsDown(UP_ARROW)){ // arrow keys for polar movement
            this.x+=this.vx;
            this.y+=this.vy;
        } 
        if(keyIsDown(DOWN_ARROW)){
            this.x-=this.vx;
            this.y-=this.vy;
        } 
        if(keyIsDown(LEFT_ARROW)){
            this.x-=this.vy;
            this.y+=this.vx;
        }
        if(keyIsDown(RIGHT_ARROW)){
            this.x+=this.vy;
            this.y-=this.vx;
        }            

        if(keyIsDown(87)){//w // wasd for  linear movement
            this.y-=this.v;
        } 
        if(keyIsDown(83)){//s
            this.y+=this.v;
        }
        if(keyIsDown(65)){//a
            this.x-=this.v;
        }
        if(keyIsDown(68)){//d
            this.x+=this.v;
        }

        if(this.x<0) this.x=0; // boundary collisions
        if(this.y<0) this.y=0;
        if(this.x+this.d>Width) this.x=Width-this.d;
        if(this.y+this.d>Height) this.y=Height-this.d;

        this.centreX=this.x+this.r; // recaclulating center coordinates
        this.centreY=this.y+this.r;
        
        
        
        
        
    }

}