const C = {};
C.Width = 1000 ;
C.Height = 600 ;
C.goalH = 100 ;
C.goalW = 50 ;
C.gap = C.Width / 40 ;
C.backgroundColor = (4, 199, 75) ; // maybe unused
C.playerRadius = 12 ;
C.ballRadius = 15 ;
C.playerAcc = 0.3 ;
C.picWidth = 48 ;
C.picHeight = 48 ;
C.animationSpeed = 0.04 ; // it is ratio by which vel is multiplied
if(typeof module != "undefined"){
    global.C = C;
}