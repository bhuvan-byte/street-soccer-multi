class Stopwatch {
    constructor(maxTime){
        this.starttime = null;
        this.timespent = 0;
        this.isRunning = false;
        this.maxTime = maxTime;
    }
    getMilliseconds(){
        let elapsed = (this.isRunning ? Date.now()-this.starttime : 0) + this.timespent;
        return this.maxTime -elapsed;
    }
    toggle(){
        if(this.isRunning) this.stop();
        else this.start();
    }
    start(){
        if (this.isRunning) return;
        this.starttime = Date.now();
        this.isRunning = true;
    }
    stop(){
        if (!this.isRunning) return;
        this.timespent += Date.now()-this.starttime;
        this.isRunning = false;
    }
    reset(){
        this.isRunning = false;
        this.timespent = 0;
    }
}
if(typeof module != "undefined"){
    global.Stopwatch = Stopwatch;
}