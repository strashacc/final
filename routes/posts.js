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
            res.status(401).clearCookie('cookie');
            return res.redirect('/login');
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
            return res.redirect('/login');
        }
        const user = new User(await db.getUser(authResult.Username));
        console.log(user.Username)
        const _id = new ObjectId(req.params.id);
        const post = new Post(await db.getPost(_id));
        var Liked = false;
        if (post.Likes.indexOf(authResult.Username) != -1)
            Liked = true;
        res.render('post', {User: user, Post: post, Liked: Liked});
    } catch (error) {
        console.log(error);
    }
});
router.get('/update/:id', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            return res.redirect('/login');
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
            return res.redirect('/login');
        }
        const user = new User(await db.getUser(authResult.Username));
        const _id = new ObjectId(req.params.id);
        const post = await db.getPost(_id);
        if (user.Username != post.Author) {
            return res.status(403).render('error', {Message: 'You are not authorized to perform this action!'});
        }
        const updates = new Post(req.body);
        const update = {$set: {Updated: Date.now()}};
        for (key in updates) {
            update.$set[key] = updates[key];
        }
        if ( !await db.updatePost(_id, update) ) {
            return res.status(500).redirect('error');
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
            return res.redirect('/login');
        }
        const user = new User(await db.getUser(authResult.Username));
        const _id = new ObjectId(req.params.id);
        const post = await db.getPost(_id);
        if (user.Username != post.Author) {
            return res.status(403).render('error', {Message: 'You are not authorized to perform this action!'});
        }
        if ( ! await db.deletePost(_id) ) {
            return res.status(500).render('error');
        }
        return res.redirect('/posts');
    } catch (error) {
        console.log(error);
    }
});
router.get('/create', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            return res.redirect('/login');
        }
        const Profile = await db.getUser(authResult.Username);
        return res.render('createPost', {User: Profile});
    } catch (error) {
        console.log(error);
    }
});
router.post('/create', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            return res.redirect('/login');
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
            return res.status(500).render('error', {Message: "We Had Some Trouble Saving Your Post"});
        }
        return res.redirect('/posts');
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

router.get('/search', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            return res.redirect('/login');
        }
        const query = req.query.search;
        var posts = undefined;
        if (query) {
            posts = await db.searchPosts(query);
        }
        console.log(posts);
        return res.render('searchPosts', {Posts: posts});
    } catch (error) {
        console.log(error);
    }
});

router.get('/post/:id/like', async (req, res) => {
    try {
        const authResult = auth(req);
        if ( !authResult ) {
            res.clearCookie('cookie');
            return res.redirect('/login');
        }
        const id = new ObjectId(req.params.id);
        const like = {$addToSet: {Likes: authResult.Username} };
        const unlike = {$pull: {Likes: authResult.Username} };
        const post = new Post( await db.getPost(id) );
        var result;
        if(post.Likes.indexOf(authResult.Username) != -1)
            result = await db.updatePost(id, unlike);
        else
            result = await db.updatePost(id, like);
        if (result)
            return res.send('OK');
        else
            return res.send('Error');
    } catch (error) {
        console.log(error);
        res.send('Error');
    }
});

module.exports = router;