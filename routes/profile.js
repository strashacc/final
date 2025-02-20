const express = require('express');
const router = express.Router();
const { User } = require('../model/user');
const { Post } = require('../model/post');
const db = require('../database/db');
const { auth } = require('../scripts/auth');
const { ObjectId } = require('mongodb');

router.get('/', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const Profile = await db.getUser(authResult.Username);
        res.render('profile', {Profile: Profile, isMyProfile: true});
    } catch (error) {
        console.log(error);
    }
});

router.get('/user/:username', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const Profile = await db.getUser(req.params.username);
        if (Profile.Username == authResult.Username) {
            res.render('profile', {Profile: Profile, isMyProfile: true});
        }
        else {
            res.render('profile', {Profile: Profile, isMyProfile: false});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/update/', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const Profile = await db.getUser(authResult.Username);
        res.render('editProfile', {Profile: Profile});
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

router.post('/update', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/delete', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;