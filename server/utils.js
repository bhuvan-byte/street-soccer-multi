const { customAlphabet } = require('nanoid');
const alphabet = '0123456789abcdefghjkmnopqrstuvwxyz';
const nanoid = (length)=>customAlphabet(alphabet,length)();

module.exports = {
    nanoid,
}
