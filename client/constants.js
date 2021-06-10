const Width = 1000;
const Height = 600;
const goalH = 100;
const goalW = 50;
const ballD = 25;
const gap = Width / 40;
const backgroundColor = (4, 199, 75);
const playerRadius = 12;
const ballRadius = 15;
const playerAcc = 0.2;
const picWidth = 48;
const picHeight = 48;
const animationSpeed = playerAcc/10;
if(typeof module != "undefined"){
    module.exports = {
        Width:Width,
        Height:Height,
        goalH: goalH,
        goalW: goalW,
        ballD: ballD,
        playerRadius: playerRadius,
        ballRadius: ballRadius,
        playerAcc: playerAcc,
        picWidth:picWidth,
        picHeight:picHeight,
        animationSpeed:animationSpeed,
    }
}