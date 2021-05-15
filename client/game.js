function setup() {
    createCanvas(Width, Height);
    ball = new Ball(Width/2,Height/2); 
    // player1 = new Player(150,100,40);
    // var player[10];
    players = [];
    for(var i=0;i<10;i++){
        players.push(new Player(random(255),random(255),random(255),random(Width)+gap+goalW,random(Height),30,radians(random(360))));
    }
}



function draw() {
    background(50, 168, 82); // green color
    noFill(); // to tell shapes are not to filled with some color

    // grid for temporary support 
    
    // stroke(20, 130, 60);
    // for (var i = 0; i < 20; i++) {
    //     line(0, i * Height / 20, Width, i * Height / 20); // horizontal
    // }
    // for (var i = 0; i < 40; i++) {
    //     line(i * Width / 40, 0, i * Width / 40, Height); // vertical
    // }

    strokeWeight(2);
    stroke(255, 255, 255); // white color to draw shapes
    // center circle
    circle(Width / 2, Height / 2, 70);

    // center line
    line(Width / 2, Height / 20, Width / 2, 19 * Height / 20);

    //left goalpost + line
    rect(gap, Height / 2 - goalH / 2, goalW, goalH);
    line(gap + goalW, Height / 20, gap + goalW, 19 * Height / 20);

    //right goalpost + line
    rect(Width - goalW - gap, Height / 2 - goalH / 2, goalW, goalH);
    line(Width - goalW - gap, Height / 20, Width - goalW - gap, 19 * Height / 20);

    // top and bottom outside lines
    line(Width / 20 + gap, Height / 20, 19 * Width / 20 - gap, Height / 20);
    line(Width / 20 + gap, 19 * Height / 20, 19 * Width / 20 - gap, 19 * Height / 20);


    // goal keeper's rectangles
    // left,right
    rect(3 * Width / 40, Height / 2 - goalH, goalW * 2, goalH * 2);
    rect(Width - 7 * Width / 40, Height / 2 - goalH, goalW * 2, goalH * 2);

    // bigger rectangles
    rect(3 * Width / 40, Height / 4, 6 * Width / 40, Height / 2);
    rect(Width - 9 * Width / 40, Height / 4, 6 * Width / 40, Height / 2);

    ball.display();

    for(var i=0;i<10;i++){
        players[i].display();
    }

}