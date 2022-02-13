"use strict";
let startBtn = document.querySelector("#start");
let tourBtn = document.querySelector('#tour-btn');

let saveNameBtn = document.querySelector('#save-name-btn');
let nam = document.querySelector('#name-input');
let bgSound = document.querySelector('#bg-sound');

document.getElementById("home").addEventListener("click",()=>{
    window.location.href = '/';
});
function copyUrl(){
    navigator.clipboard.writeText(document.location.href);
    let clipboard = document.querySelector('#clipboard-btn');
    let oldClipboard = clipboard.innerHTML;
    clipboard.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check-fill" viewBox="0 0 16 16"> <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z"/> <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z"/> </svg>'
    setTimeout(()=>{
        clipboard.innerHTML = oldClipboard;
    },1000);
}

function setEventListener(){
    // Activate bootstrap tooltips 
    // var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    // var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl)
    // })
    


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
        if(startBtn.innerText=='Start' || startBtn.innerText=='Play'){
            startBtn.innerText = 'Pause'
        } else {
            startBtn.innerText = 'Play'
        }

    });
    document.querySelector("#change-team").addEventListener('click',()=>{
        sock.emit('changeTeam', (apna_player.teamName== "A")?"B":"A" );
    });
    muteBtn.addEventListener('click',()=>{
        mute = 1-mute;
        localStorage.setItem('mute',String(mute));
        // if(muteBtn.innerText[0]=='M'){
        //     muteBtn.innerText = 'Unmute';
        // } else{
        //     muteBtn.innerText = 'Mute';
        // }
        if(mute==1){
            // muteBtn.innerText = 'Unmute';
            muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute" viewBox="0 0 16 16"> <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/> </svg>';
        } else{
            // muteBtn.innerText = 'Mute';
            muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-up" viewBox="0 0 16 16"> <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/> <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/> <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"/> </svg>';
        }
        bgSound.muted = !bgSound.muted;
    });
    // saveNameBtn.addEventListener('click',setName)
    let bgSlider = document.querySelector('#bg-vol-slider');
    bgSlider.addEventListener('input',()=>{
        bgSound.volume = bgSlider.value;
    });

    let gameLen = document.querySelector('#game-time');
    let gameLenBtns = document.querySelectorAll('.game-time-close-btn');
    gameLenBtns.forEach(elt=>{
        elt.addEventListener('click',()=>{
            // set game length from here if game not yet started.
            sock.emit('modify-game-time',gameLen.value);
        });
    });

    let leftArea = document.querySelector('#left-area');
    let rightArea = document.querySelector('#right-area');
    leftArea.style.display = 'none';
    rightArea.style.display = 'none';

    tourBtn.addEventListener('click',()=>{
        // Give users a tour of all butttons.
        // Start button -> Scores -> Share -> Joysticks -> Tackle
        // startBtn.classList.remove('highlight')
    })

    let bgOpt = document.querySelector('#theme-slider');
    bgOpt.addEventListener('input',()=>{
        changeTheme(bgOpt.value);
    })
}

function changeTheme(bgOpt){
    let navbarBtns = document.querySelectorAll('.navbar-btn-my');
    if(bgOpt == 1){
        bgColor = '#21252f';
        for(let btn of navbarBtns){
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-light')
        }
    } else{
        bgColor = '#32a852';
        for(let btn of navbarBtns){
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline-light')
        }
    }
    // add code to change class of navbar buttons
    // btn-primary color -> #017bfe
    // btn-dark color -> #343b41
}

function playBg(){
    bgSound.play();
    if(localStorage.mute=='1'){
        bgSound.muted = 1;
        muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute" viewBox="0 0 16 16"> <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/> </svg>';
    } else{
        localStorage.mute = '0'
    }
}


function setName(){
    let pname = nam.value;
    pname = pname.substr(0,Math.min(pname.length,8));
    localStorage.setItem('name',pname);
    sock.emit('name',pname);
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

