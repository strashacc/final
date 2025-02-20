require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const profile = require('./routes/profile');
const cookieparser = require('cookie-parser');
const redirect = require('express-redirect');
const PORT = process.env.PORT;

app.use(cookieparser());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({extended: false}));



redirect(app);
app.redirect('/login', '/auth/login');
app.redirect('/signup', '/auth/signup');

app.use('/auth', auth);
app.use('/posts', posts);
app.use('/profile', profile);

app.listen(PORT, console.log(`Server listening at http://localhost:${PORT}`));