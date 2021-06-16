class Field{
    display(){
        background(50, 168, 82); // green color
        noFill(); // to tell shapes are not to filled with some color
        
        // grid for temporary support 
        
        // stroke(20, 130, 60);
        // for (var i = 0; i < 20; i++) {
        //     line(0, i * C.ygap, C.Width, i * C.ygap); // horizontal
        // }
        // for (var i = 0; i < 40; i++) {
        //     line(i * C.Width / 40, 0, i * C.Width / 40, C.Height); // vertical
        // }
        
        strokeWeight(2);
        stroke(255, 255, 255); // white color to draw shapes
        // center circle
        circle(C.Width / 2, C.Height / 2, 70);
        
        // center line
        line(C.Width / 2, C.ygap, C.Width / 2, C.Height -  C.ygap);
        
        //left goalpost + line
        rect(C.xgap, C.Height / 2 - C.goalH / 2, C.goalW, C.goalH);
        line(C.xgap + C.goalW, C.ygap, C.xgap + C.goalW, 19 * C.ygap);
        
        //right goalpost + line
        rect(C.Width - C.goalW - C.xgap, C.Height / 2 - C.goalH / 2, C.goalW, C.goalH);
        line(C.Width - C.goalW - C.xgap, C.ygap, C.Width - C.goalW - C.xgap, 19 * C.ygap);
        
        // top and bottom outside lines
        line(C.Width / 20 + C.xgap, C.ygap, 19 * C.Width / 20 - C.xgap, C.ygap);
        line(C.Width / 20 + C.xgap, 19 * C.ygap, 19 * C.Width / 20 - C.xgap, 19 * C.ygap);
        
        
        // goal keeper's rectangles
        // left,right
        rect(3 * C.Width / 40, C.Height / 2 - C.goalH, C.goalW * 2, C.goalH * 2);
        rect(C.Width - 7 * C.Width / 40, C.Height / 2 - C.goalH, C.goalW * 2, C.goalH * 2);
        
        // bigger rectangles
        rect(3 * C.Width / 40, C.Height / 4, 6 * C.Width / 40, C.Height / 2);
        rect(C.Width - 9 * C.Width / 40, C.Height / 4, 6 * C.Width / 40, C.Height / 2);
    }
}