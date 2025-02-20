require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const DB = process.env.DB;
const {MongoClient} = require('mongodb');
const client = new MongoClient(MONGODB_URI);

async function ping() {
    try{
        await client.connect();

    } catch (error) {

    } finally {

    }
}

async function addUser (User) {
    try {
        await client.connect();

        const db = client.db(DB);
        const col = db.collection('users');

        const response = await col.insertOne(User);

        return response.acknowledged;

    } catch (error) {

    } finally {
        await client.close();
    }
}

async function getUser (Username) {
    try {
        await client.connect();

        const db = client.db(DB);
        const col = db.collection('users');

        const response = await col.findOne({Username: Username});

        return response;
    } catch (error) {

    } finally {
        await client.close();
    }
}

async function addPost(Post) {
    try {
        await client.connect();

        const db = client.db(DB);
        const col = db.collection('posts');

        const response = await col.insertOne(Post);

        return response.acknowledged;

    } catch (error) {

    } finally {
        await client.close();
    }
}

async function getPosts(skip, limit) {
    try {
        await client.connect();

        const db = client.db(DB);
        const col = db.collection('posts');

        const response = await col.find().skip(skip).limit(limit).toArray();

        return response;
    } catch (error) {

    } finally {
        await client.close();
    }
}

async function getPost(_id) {
    try {
        await client.connect();

        const db = client.db(DB);
        const col = db.collection('posts');

        const response = await col.findOne({_id: _id});

        return response;
    } catch (error) {

    } finally {
        await client.close();
    }
}

async function updatePost(_id, update) {
    try {
        await client.connect();

        const db = client.db(DB);
        const col = db.collection('posts');        

        const response = await col.updateOne({_id: _id}, update);
        console.log(response);
        return response.acknowledged;
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

async function deletePost(_id) {
    try {
        await client.connect();

        const db = client.db(DB);
        const col = db.collection('posts');        

        const response = await col.deleteOne({_id: _id});
        return response.acknowledged;
    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

module.exports = {addUser, getUser, addPost, getPosts, getPost, updatePost, deletePost};