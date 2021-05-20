module.exports = {
    newRoomName,
}

function newRoomName(length){
    let result = '';
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for(let i=0;i<length;i++){
        result+= charSet.charAt(Math.floor(Math.random()*charSet.length));
    }
    return result;
}