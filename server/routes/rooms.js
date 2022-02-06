const express = require('express');
const { Game } = require('../game');
const { nanoid,logip } = require('../utils');

const router = express.Router();


router.get('/create', (req,res)=>{
    console.log('[+] Create Room');
    let roomName;
    while ((roomName = nanoid(4)) in games){
        console.log("collided",roomName,games.keys());
    }
    games[roomName] = new Game(roomName);
    games[roomName].run();
    res.redirect(`${roomName}`);
})
router.get('/allrooms',(req,res)=>{
    let roomList = {};
    for(let room in games){
        roomList[room] = Object.keys(games[room].players).length;
    }
    res.json(roomList);
})
router.get('/',(req,res)=>{
    console.log('[+] get rooms')
    res.send('hi')
})
router.get('/:roomName', async (req,res)=>{
    await logip(req,res);
    let roomName = req.params.roomName;
    if(roomName in games){
        res.render('../client/game/game.ejs',{roomName:roomName});
    }else{
        res.redirect('/');
    }
})


module.exports = router