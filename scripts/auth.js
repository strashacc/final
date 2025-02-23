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
async function auth(req, res, next) {
    const token = req.cookies['cookie'];
    if (!token && !req.path.startsWith('/auth') && req.path != '/posts/getPosts') {
        res.clearCookie('cookie');
        return res.redirect('/auth/login');
    }
    else if (req.path.startsWith('/auth') || req.path != '/posts/getPosts') {
        return next();
    }
    const validation = validateToken(token);
    const user = await db.getUser(validation.Username);
    if( !validation || !user) {
        res.clearCookie('cookie');
        return res.redirect('/auth/login');
    }
    return next();
}

module.exports = {validateToken, auth};