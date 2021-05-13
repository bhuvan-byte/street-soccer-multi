class Ball{
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.r=30;

        this.img = loadImage('assets/ball.png');
    }
    display(){
        image(this.img,this.x-this.r/2,this.y-this.r/2,this.r,this.r);
    }

}