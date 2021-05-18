function setup() {
    createCanvas(Width, Height);
    ball = new Ball(Width/2,Height/2); 
    field = new Field();
    players = [];
    players.push(new Player(random(Width)+gap+goalW,random(Height),30,radians(random(360))));
    
}


function draw() {
    field.display();

    ball.display();

    for(let i=players.length-1;i>=0;i--){
        players[i].display();
    }

}