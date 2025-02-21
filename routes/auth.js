require('dotenv').config();
const express = require('express');
const router = express.Router();
const validator = require('validator');
const {User} = require('../model/user');
const db = require('../database/db');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', async (req, res) => {
    try {
        const creds = new User(req.body);
        const user = await db.getUser(creds.Username);
        if (!user) {
            return res.render('login', {Message: 'Incorrect Username or Password!'});
        }
        bcrypt.compare(creds.Password, user.Password, (err, result) => {
            if (!result) {
                return res.render('login', {Message: 'Incorrect Username or Password!'});
            }
            const token = jwt.sign({Username: user.Username}, PRIVATE_KEY, {algorithm: 'RS512'});
            res.cookie('cookie', token);
            return res.redirect('/posts');
        });
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
            return res.render('signup', {Message: Validation.Message});
        }
        bcrypt.hash(newUser.Password, saltRounds, async (err, hash) => {
            newUser.Password = hash;
            if ( !await db.addUser(newUser) ){
                console.log('Error creating new user');
                return res.status(500).redirect('error');
            }
            const token = jwt.sign({Username: newUser.Username}, PRIVATE_KEY, {algorithm: 'RS512'});
            res.cookie('cookie', token);
            return res.redirect('/posts');
        });
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