const Width = 1000;
const Height = 600;
const goalH = 100;
const goalW = 50;
const ballD = 25;
const gap = Width / 40;
const backgroundColor = (4, 199, 75);
const playerRadius = 20;
const ballRadius = 30;
if(typeof module != "undefined"){
    module.exports = {
        Width:Width,
        Height:Height,
        goalH: goalH,
        goalW: goalW,
        ballD: ballD,
        playerRadius: playerRadius,
        ballRadius: ballRadius,
    }
}