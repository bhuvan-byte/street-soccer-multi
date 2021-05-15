class Player{
    constructor(R,G,B,x,y,d,theta){
        this.R=R;
        this.G=G;
        this.B=B;
        this.x=x;
        this.y=y;
        this.d=d;
        this.r=this.d/2;
        this.theta=atan((mouseY-Height/2)/(mouseX-Width/2));
        this.centreX=this.x-this.r;
        this.centreY=this.y-this.r;
        this.v=3; 
        this.vx=this.v*cos(this.theta);
        this.vy=this.v*sin(this.theta);       
    }
    display(){
        // fill(random(255),random(255),random(255));
        fill(this.R,this.G,this.B)
        ellipse(this.centreX,this.centreY,this.d,this.d);
        stroke(255, 255, 255); // white color to draw shapes
        this.theta=atan(abs(((mouseY-this.centreY)/(mouseX-this.centreX))));
        
        this.vx=this.v*cos(this.theta);
        this.vy=this.v*sin(this.theta); 
        // line(this.centreX,this.centreY,mouseX,mouseY);
        if(mouseX>this.centreX && mouseY<this.centreY){
            //1st quadrant +,-
            line(this.centreX,this.centreY,this.centreX+this.r*cos(this.theta),this.centreY-this.r*sin(this.theta));
            if(keyIsPressed === true ){
                if(key=='w'){
                    // fwd
                    this.x+=this.vx;
                    this.y-=this.vy;
                } else if(key=='s'){
                    //bkwd
                    this.x-=this.vx;
                    this.y+=this.vy;
                } else if(key=='a'){
                    // left
                    this.x-=this.vy;
                    this.y-=this.vx;
                } else if(key=='d'){
                    // right
                    this.x+=this.vy;
                    this.y+=this.vx;
                }

            } 

        } else if(mouseX>this.centreX){
            //4th quadrant +,+
            line(this.centreX,this.centreY,this.centreX+this.r*cos(this.theta),this.centreY+this.r*sin(this.theta));

            if(keyIsPressed === true ){
                if(key=='w'){
                    // fwd
                    this.x+=this.vx;
                    this.y+=this.vy;
                } else if(key=='s'){
                    //bkwd
                    this.x-=this.vx;
                    this.y-=this.vy;
                } else if(key=='a'){
                    // left
                    this.x+=this.vy;
                    this.y-=this.vx;
                } else if(key=='d'){
                    // right
                    this.x-=this.vy;
                    this.y+=this.vx;
                }


            } 
        } else if(mouseY<this.centreY){
            //2nd quadrant -,-
            line(this.centreX,this.centreY,this.centreX-this.r*cos(this.theta),this.centreY-this.r*sin(this.theta));
            if(keyIsPressed === true ){
                if(key=='w'){
                    // fwd
                    this.x-=this.vx;
                    this.y-=this.vy;
                } else if(key=='s'){
                    //bkwd
                    this.x+=this.vx;
                    this.y+=this.vy;
                } else if(key=='a'){
                    // left
                    this.x-=this.vy;
                    this.y+=this.vx;
                } else if(key=='d'){
                    // right
                    this.x+=this.vy;
                    this.y-=this.vx;
                }

            } 
        } else{
            //3rd quadrant-,+
            line(this.centreX,this.centreY,this.centreX-this.r*cos(this.theta),this.centreY+this.r*sin(this.theta));
            if(keyIsPressed === true ){
                if(key=='w'){
                    // fwd
                    this.x-=this.vx;
                    this.y+=this.vy;
                } else if(key=='s'){
                    //bkwd
                    this.x+=this.vx;
                    this.y-=this.vy;
                } else if(key=='a'){
                    // left
                    this.x+=this.vy;
                    this.y+=this.vx;
                } else if(key=='d'){
                    // right
                    this.x-=this.vy;
                    this.y-=this.vx;
                }

            } 
        }
        this.centreX=this.x-this.r;
        this.centreY=this.y-this.r;
        
    }

}