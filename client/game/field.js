class Field{
    display(bgColor){
        // background(50, 168, 82); // green color
        // background(52,58,64); // dark
        // background(33,37,47); // darker
        background(bgColor)
        noFill(); // to tell shapes are not to filled with some color
        
        // grid for temporary support 
        
        // stroke(20, 130, 60);
        // stroke(255,255,255,150);
        // strokeWeight(1);
        // for (var i = 0; i <= 20; i++) {
        //     line(0, i * C.ygap, C.Width, i * C.ygap); // horizontal
        // }
        // for (var i = 0; i <= 40; i++) {
        //     line(i * C.xGoalGap , 0, i * C.xGoalGap , C.Height); // vertical
        // }
        
        strokeWeight(2);
        stroke(255, 255, 255); // white color to draw shapes
        // center circle
        circle(C.Width / 2, C.Height / 2, 70);
        
        // center line
        line(C.Width / 2, C.ygap, C.Width / 2, C.Height -  C.ygap);
        
        //left goalpost + right goalpost
        rect(C.xGoalGap, C.Height / 2 - C.goalH / 2, C.goalW, C.goalH);
        rect(C.Width - C.xgap, C.Height / 2 - C.goalH / 2, C.goalW, C.goalH);
        
        push();fill(255,255,255);
        // left goalpole
        ellipse(C.xGoalGap+C.goalW,C.Height / 2 - C.goalH / 2,C.goalPoleRad*2);
        ellipse(C.xGoalGap+C.goalW,C.Height / 2 + C.goalH / 2,C.goalPoleRad*2);
        ellipse(C.Width - C.xgap, C.Height / 2 - C.goalH / 2, C.goalPoleRad*2);
        ellipse(C.Width - C.xgap, C.Height / 2 + C.goalH / 2, C.goalPoleRad*2);
        pop();

        // boudary lines top, bottom right left 
        line(C.xgap, C.ygap, C.Width - C.xgap, C.ygap);
        line(C.xgap, C.Height - C.ygap, C.Width - C.xgap, C.Height - C.ygap);
        line(C.Width - C.xgap, C.ygap, C.Width - C.xgap, C.Height - C.ygap);        
        line(C.xgap, C.ygap, C.xgap, C.Height - C.ygap);
        
        
        // goal keeper's rectangles
        // left,right
        rect(C.xgap, C.Height / 2 - C.goalH, C.goalW * 2, C.goalH * 2);
        rect(C.Width - C.xgap - C.goalW*2, C.Height / 2 - C.goalH, C.goalW * 2, C.goalH * 2);
        
        // bigger rectangles
        rect(C.xgap, C.Height / 4, 6 * C.xGoalGap, C.Height / 2);
        rect(C.Width - C.xgap - 6 * C.xGoalGap, C.Height / 4, 6 * C.xGoalGap, C.Height / 2);
    }
}