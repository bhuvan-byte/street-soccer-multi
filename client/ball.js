class Ball extends Entity{
    constructor(img){
        super(50,50,30); // remove hardcoded value
        this.img = img;
        this.img.resize(this.radius,this.radius);
    }
    display(){
        // console.log("Ball display");
        image(this.img,this.x-this.radius/2,this.y-this.radius/2,this.radius,this.radius);
    }
}