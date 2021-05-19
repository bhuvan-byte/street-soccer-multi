module.exports = {
    makeNewRoom,
}

function makeNewRoom(length){
    let result = '';
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0;i<length;i++){
        result+= charSet.charAt(Math.floor(Math.random()*charSet.length));
    }
    return result;
}