const fs = require('fs');
const jwt = require('jsonwebtoken');

function validateToken(token) {
    try{
        const pubKey = fs.readFileSync('key.pub').toString();
        const decrypted = jwt.verify(token, pubKey);
        return decrypted.valueOf();
    } catch (error) {
        console.log(error);
        return false;
    }
}
function auth(req) {
    const token = req.cookies['cookie'];
    if (!token) {
        return false;
    }
    const validation = validateToken(token);
    if( !validation ) {
        return false;
    }
    return validation;
}

module.exports = {validateToken, auth};