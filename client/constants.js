const C = {};
C.Width = 1000 ;
C.Height = 600 ;
C.goalH = 100 ;
C.goalW = 50 ;
C.xGoalGap = C.Width / 40 ;
C.ygap = C.Height / 20;
C.xgap = C.xGoalGap + C.goalW;
C.backgroundColor = (4, 199, 75) ; // maybe unused
C.playerRadius = 12 ;
C.ballBigRadius = 15;
C.ballRadius = 10 ;
C.shootSpeed = 9;
C.playerAcc = 0.3 ;
C.playerAccFac = 0.7;
C.picWidth = 48 ;
C.picHeight = 48 ;
C.wall_e_ball = 0.9;
C.animationSpeed = 0.04 ; // it is ratio by which vel is multiplied
C.scaleFieldX = C.Width/40; // to multiply with coordinates from formation
C.scaleFieldY = C.Height/20;

// currently made for <=7 players/team
// |-7-|-6-|-4-||-4-|-6-|-7-|
const basic_formation = {
    teamL:[
            {x:10,y:10},
            {x:16,y:7},
            {x:16,y:13},
            {x:10,y:5},
            {x:10,y:15},
            {x:16,y:17},
            {x:16,y:3}
            
    ],
    teamR:[
            {x:30,y:10},
            {x:24,y:13},
            {x:24,y:7},
            {x:30,y:15},
            {x:30,y:5},
            {x:24,y:3},
            {x:24,y:17}
    ]
}
if(typeof module != "undefined"){
    global.C = C;
    global.basic_formation = basic_formation;
}