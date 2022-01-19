const express = require('express');
const router = express.Router();

router.post('/create', (req,res)=>{
    console.log('[+] Create Room')
})
router.get('/',(req,res)=>{
    console.log('[+] get rooms')
    res.send('hi')
})
router.get('/:id', (req,res)=>{
    console.log(`${id}`)
})


module.exports = router