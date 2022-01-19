const express = require('express');
const { Game } = require('../game');
const { nanoid } = require('../utils');

const router = express.Router();


router.get('/create', (req,res)=>{
    console.log('[+] Create Room');
    let roomName;
    while ((roomName = nanoid(4)) in games){
        console.log("collided",roomName,games.keys());
    }
    games[roomName] = new Game(roomName);
    res.redirect(`${roomName}`);
})
router.get('/',(req,res)=>{
    console.log('[+] get rooms')
    res.send('hi')
})
router.get('/:roomName', (req,res)=>{
    let roomName = req.params.roomName;
    console.log(`${roomName}`);
    res.render('../client/game/game.ejs',{roomName:roomName});
})


module.exports = router