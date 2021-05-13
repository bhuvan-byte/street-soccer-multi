class Player{
    constructor(R,G,B,x,y,radius){
        this.R=R;
        this.G=G;
        this.B=B;
        this.x=x;
        this.y=y;
        this.r=30;
    }
    display(){
        // fill(random(255),random(255),random(255));
        fill(this.R,this.G,this.B)
        circle(this.x-this.r/2,this.y-this.r/2,this.r);
    }

}