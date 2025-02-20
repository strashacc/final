const express = require('express');
const router = express.Router();
const validator = require('validator');
const {User} = require('../model/user');
const db = require('../database/db');
const fs = require('fs');
const {validateToken} = require('../scripts/auth');
const jwt = require('jsonwebtoken');

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', async (req, res) => {
    try {
        const creds = new User(req.body);
        const user = new User( await db.getUser(creds.Username) );
        if (user && creds.Password != user.Password) {
            res.render('login', {Message: 'Incorrect Username or Password!'});
        }
        key = fs.readFileSync('key.priv').toString();
        console.log(key);
        const token = jwt.sign({Username: user.Username}, key, {algorithm: 'RS512'});
        res.cookie('cookie', token);
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

router.get('/signup', (req, res) => {
    res.render('signup');
});
router.post('/signup', async (req, res) => {
    const newValidator = new usernameValidator( 
                         new passwordValidator() );
    try {
        const newUser = new User(req.body);
        console.log(newUser);
        // Validation
        const Validation = await newValidator.validate(newUser);
        if (Validation.Status == 'OK') {
            console.log('success');
        }
        else {
            console.log(Validation.Message);
            res.render('signup', {Message: Validation.Message});
        }
        if ( !db.addUser(newUser) ){
            console.log('Error creating new user');
            res.status(500).redirect('error');
        }
        key = fs.readFileSync('key.priv').toString();
        console.log(key);
        const token = jwt.sign({Username: newUser.Username}, key, {algorithm: 'RS512'});
        res.cookie('cookie', token);
        res.redirect('/posts');
    } catch (error) {
        console.log(error)
        res.status(500).send('error'); // Add Error page
    }
});

module.exports = router;

class Validator {
    async validate(User) {}
    next(User) {
        if ( !this.nextValidator )
            return {Status: 'OK'};
        else
            return this.nextValidator.validate(User);
    }
    constructor (nextValidator, simpleHandler) {
        if (nextValidator)
            this.nextValidator = nextValidator;
        if (simpleHandler)
            this.simpleHandler = simpleHandler;
    }
}
class usernameValidator extends Validator {
    async validate(User) {
        if ( !validator.isAlphanumeric(User.Username) ) {
            return {Status: 'Error', Message: 'Username must consist only from alphanumeric characters!'};
        }
        else if ( await db.getUser(User.Username) ) {
            return {Status: 'Error', Message: 'Username already exists'};
        }
        else {
            return this.next(User);
        }
    }
}
class passwordValidator extends Validator {
    async validate(User) {
        if ( !validator.isStrongPassword(User.Password) ) {
            return {Status: 'Error', Message: 'Your password is not strong enough!'};
        }
        else {
            return this.next(User);
        }
    }
}