const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { auth } = require('../scripts/auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', async (req, res) => {
    try {
        const authResult = await auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const Profile = await db.getUser(authResult.Username);
        const Posts = await db.getPosts(0, 100, {Author: Profile.Username} );
        const Stats = await db.getPostStats(Profile.Username);
        res.render('profile', {Profile: Profile, isMyProfile: true, Posts: Posts, Stats: Stats});
    } catch (error) {
        console.log(error);
    }
});

router.get('/user/:username', async (req, res) => {
    try {
        const authResult = await auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const Profile = await db.getUser(req.params.username);
        const Posts = await db.getPosts(0, 100, {Author: Profile.Username} );
        const Stats = await db.getPostStats(Profile.Username);
        if (Profile.Username == authResult.Username) {
            res.render('profile', {Profile: Profile, isMyProfile: true, Posts: Posts, Stats: Stats});
        }
        else {
            res.render('profile', {Profile: Profile, isMyProfile: false, Posts: Posts, Stats: Stats});
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/update/', async (req, res) => {
    try {
        const authResult = await auth(req);
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
        const authResult = await auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        update = {$set: {} }
        for (field in req.body) {
            if (req.body[field])
                update.$set[field] = req.body[field];
        }
        console.log(update);
        if (req.body.Password) {
            bcrypt.hash(req.body.Password, saltRounds, async (err, hash) => {
                update.$set.Password = hash;
                if ( ! await db.updateUser(authResult.Username, update) ) {
                    return res.redirect('error');
                }
                return res.redirect('/profile');
            });
        }
        else{
            if ( ! await db.updateUser(authResult.Username, update) ) {
                return res.redirect('error');
            }
            return res.redirect('/profile');
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/delete', async (req, res) => {
    try {
        const authResult = await auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        if (! await db.deleteUser(authResult.Username) ) {
            res.redirect('error');
        }
        res.clearCookie('cookie');
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', async (req, res) => {
    try {
        const authResult = await auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        res.clearCookie('cookie');
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;