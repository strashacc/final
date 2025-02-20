require('dotenv').config();
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const jwt = require('jsonwebtoken');
const db = require('../database/db');

function validateToken(token) {
    try{
        const decrypted = jwt.verify(token, PUBLIC_KEY);
        return decrypted.valueOf();
    } catch (error) {
        console.log(error);
        return false;
    }
}
async function auth(req) {
    const token = req.cookies['cookie'];
    if (!token) {
        return false;
    }
    const validation = validateToken(token);
    const user = await db.getUser(validation.Username);
    if( !validation || !user) {
        return false;
    }
    return validation;
}

module.exports = {validateToken, auth};