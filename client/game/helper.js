"use strict";
let startBtn = document.querySelector("#start");
let saveNameBtn = document.querySelector('#save-name-btn');
let nam = document.querySelector('#name-input');
let bgSound = document.querySelector('#bg-sound');

document.getElementById("home").addEventListener("click",()=>{
    window.location.href = '/';
});
function copyUrl(){
    navigator.clipboard.writeText(document.location.href);
}

function setEventListener(){
    setInterval(() => {
        let tbodyRed = document.querySelector("#red-team tbody");
        let tbodyBlue = document.querySelector("#blue-team tbody");
        tbodyRed.innerHTML = tbodyBlue.innerHTML = "";
        for(const p of Object.values(game.players)){
            let tbody;
            if(p.teamName =='A') tbody = tbodyBlue;
            else tbody = tbodyRed;
            tbody.insertRow().insertCell().innerText = p.username;
        }
    }, 1000);
    canvasDiv.addEventListener('mousedown',(e)=>{
        sock.emit("shoot",getMouseTransformed());
    });
    document.querySelector('#tackle').addEventListener('touchstart',()=>{
        sock.emit("tackle")
    });
    document.addEventListener('keydown',(e)=>{
        // console.log(e.code);
        let ecode = e.code;
        if(ecode in moveKeyMap) ecode = moveKeyMap[ecode];
        if(!e.repeat && (ecode in pressed)){
            sock.emit("keypress",{ecode:ecode,direction:1});
            // this.moveHandler(e.code,1);
        }
        if(!e.repeat && ecode == "Space"){
            e.preventDefault();
            sock.emit("tackle");
        }
    });
    document.addEventListener('keyup',(e)=>{
        let ecode = e.code;
        if(ecode in moveKeyMap) ecode = moveKeyMap[ecode];
        if(!e.repeat && (ecode in pressed)){
            sock.emit("keypress",{ecode:ecode,direction:0});
            // this.moveHandler(e.code,1);
        }
    });
    joystick = new VirtualJoystick({
        container : document.querySelector("#canvasDiv"),
        // stickRadius : 30,
        innerRadius : 20,
        outerRadius : 40,
        stickRadius: 40,
        // strokeStyle1: 'cyan',
        // strokeStyle2: 'yellow',
        // strokeStyle3: 'pink',
        limitStickTravel: true,
        mouseSupport: true,// comment this to remove joystick from desktop site
    })

    joystick.addEventListener('touchStartValidation', (e)=>{
        var touch	= e.changedTouches[0];
		if(touch.pageX < window.innerWidth/2)
		    return true
        return false;
    })

    shootingBtn = new VirtualJoystick({
        container : document.querySelector("#canvasDiv"),
        limitStickTravel:true,
        innerRadius : 20,
        outerRadius : 40,
        stickRadius : 40,
        // mouseSupport:true,
        strokeStyle1: '#f1000077',
        strokeStyle3: '#e4353577',
    })

    shootingBtn.addEventListener('touchStartValidation', (e)=>{
        var touch	= e.changedTouches[0];
		if(touch.pageX > window.innerWidth/2)
		    return true
        return false;
    })
    startBtn.addEventListener('click',()=>{
        sock.emit("start/pause-signal");
        if(startBtn.innerText[0]=='S'){
            startBtn.innerText = 'Pause'
        } else {
            startBtn.innerText = 'Start'
        }

    });
    document.querySelector("#change-team").addEventListener('click',()=>{
        sock.emit('changeTeam', (apna_player.teamName== "A")?"B":"A" );
    });
    muteBtn.addEventListener('click',()=>{
        mute = 1-mute;
        if(muteBtn.innerText[0]=='M'){
            muteBtn.innerText = 'Unmute';
        } else{
            muteBtn.innerText = 'Mute';
        }
        bgSound.muted = !bgSound.muted;
    });
    saveNameBtn.addEventListener('click',()=>{
        let pname = nam.value;
        pname = pname.substr(0,Math.min(pname.length,8));
        localStorage.setItem('name',pname);
        // we also need to fire a socket event to tell name to server
        sock.emit('name',pname);
    })
    let bgSlider = document.querySelector('#bg-vol-slider');
    bgSlider.addEventListener('input',()=>{
        bgSound.volume = bgSlider.value;
    })
}
function extractImage(fullImage){
    let x=0,y=0,imageList = [];
    for(let r=0;r<4;r++){
        // let oneAnimation = [];
        y=r*C.picHeight;
        x=0;
        for(let c=0;c<3;c++){
            let img = fullImage.get(x,y,C.picWidth,C.picHeight);
            imageList.push(img);
            x+=C.picWidth;
        }
    }
    let img = fullImage.get(0,C.picHeight,C.picWidth,C.picHeight);
    imageList.push(img); imageList.push(img); imageList.push(img);
    return imageList;
}

