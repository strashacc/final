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
        
        res.render('postsPage', {User: Profile});
    } catch (error) {
        console.log(error);
    }
});
router.get('/getPosts', async (req, res) => {
    try {
        const skip = parseInt(req.query.skip);
        const posts = await db.getPosts(skip, 20);
        res.render('posts', {Posts: posts});
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});
router.get('/post/:id', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const user = new User(await db.getUser(authResult.Username));
        console.log(user.Username)
        const _id = new ObjectId(req.params.id);
        const post = await db.getPost(_id);
        res.render('post', {User: user, Post: post});
    } catch (error) {
        console.log(error);
    }
});
router.get('/update/:id', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const user = new User(await db.getUser(authResult.Username));
        const _id = new ObjectId(req.params.id);
        const post = await db.getPost(_id);
        if (user.Username != post.Author) {
            res.status(403).render('error', {Message: 'You are not authorized to perform this action!'});
            return;
        }
        res.render('editPost', {User: user, Post: post});
    } catch (error) {
        console.log(error);
    }
});
router.post('/update/:id', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const user = new User(await db.getUser(authResult.Username));
        const _id = new ObjectId(req.params.id);
        const post = await db.getPost(_id);
        if (user.Username != post.Author) {
            res.status(403).render('error', {Message: 'You are not authorized to perform this action!'});
            return;
        }
        const updates = new Post(req.body);
        const update = {$set: {Updated: Date.now()}};
        for (key in updates) {
            update.$set[key] = updates[key];
        }
        if ( !await db.updatePost(_id, update) ) {
            res.status(500).redirect('error');
            return;
        } 
        res.redirect(`/posts/post/${_id}`);
    } catch (error) {
        console.log(error);
    }
});
router.post('/delete/:id', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const user = new User(await db.getUser(authResult.Username));
        const _id = new ObjectId(req.params.id);
        const post = await db.getPost(_id);
        if (user.Username != post.Author) {
            res.status(403).render('error', {Message: 'You are not authorized to perform this action!'});
            return;
        }
        if ( ! await db.deletePost(_id) ) {
            res.status(500).render('error');
        }
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
    }
});
router.get('/create', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const Profile = await db.getUser(authResult.Username);
        res.render('createPost', {User: Profile});
    } catch (error) {
        console.log(error);
    }
});
router.post('/create', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            res.redirect('/login');
        }
        const newPost = new Post(req.body);
        newPost.Content = {};
        for (let item in req.body) {
            if (item.startsWith('Content')) {
                console.log(item);
                const key = item.substring(item.indexOf('.') + 1, item.length);
                newPost.Content[key] = req.body[item];
            }
        }
        newPost.Author = authResult.Username;
        newPost.Created = Date.now();
        
        console.log(newPost);

        if ( ! (await db.addPost(newPost)) ) {
            res.status(500).render('error', {Message: "We Had Some Trouble Saving Your Post"});
        }
        res.redirect('/posts');
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

module.exports = router;