class Field{
    display(){
        background(50, 168, 82); // green color
        noFill(); // to tell shapes are not to filled with some color
        
        // grid for temporary support 
        
        // stroke(20, 130, 60);
        // for (var i = 0; i < 20; i++) {
        //     line(0, i * C.Height / 20, C.Width, i * C.Height / 20); // horizontal
        // }
        // for (var i = 0; i < 40; i++) {
        //     line(i * C.Width / 40, 0, i * C.Width / 40, C.Height); // vertical
        // }
        
        strokeWeight(2);
        stroke(255, 255, 255); // white color to draw shapes
        // center circle
        circle(C.Width / 2, C.Height / 2, 70);
        
        // center line
        line(C.Width / 2, C.Height / 20, C.Width / 2, 19 * C.Height / 20);
        
        //left goalpost + line
        rect(C.gap, C.Height / 2 - C.goalH / 2, C.goalW, C.goalH);
        line(C.gap + C.goalW, C.Height / 20, C.gap + C.goalW, 19 * C.Height / 20);
        
        //right goalpost + line
        rect(C.Width - C.goalW - C.gap, C.Height / 2 - C.goalH / 2, C.goalW, C.goalH);
        line(C.Width - C.goalW - C.gap, C.Height / 20, C.Width - C.goalW - C.gap, 19 * C.Height / 20);
        
        // top and bottom outside lines
        line(C.Width / 20 + C.gap, C.Height / 20, 19 * C.Width / 20 - C.gap, C.Height / 20);
        line(C.Width / 20 + C.gap, 19 * C.Height / 20, 19 * C.Width / 20 - C.gap, 19 * C.Height / 20);
        
        
        // goal keeper's rectangles
        // left,right
        rect(3 * C.Width / 40, C.Height / 2 - C.goalH, C.goalW * 2, C.goalH * 2);
        rect(C.Width - 7 * C.Width / 40, C.Height / 2 - C.goalH, C.goalW * 2, C.goalH * 2);
        
        // bigger rectangles
        rect(3 * C.Width / 40, C.Height / 4, 6 * C.Width / 40, C.Height / 2);
        rect(C.Width - 9 * C.Width / 40, C.Height / 4, 6 * C.Width / 40, C.Height / 2);
    }
}