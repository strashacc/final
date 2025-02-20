require('dotenv').config();
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const jwt = require('jsonwebtoken');

function validateToken(token) {
    try{
        const decrypted = jwt.verify(token, PUBLIC_KEY);
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