require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const profile = require('./routes/profile');
const cookieParser = require('cookie-parser');
const redirect = require('express-redirect');
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));


redirect(app);
app.redirect('/login', '/auth/login');
app.redirect('/signup', '/auth/signup');
app.redirect('/', '/posts');

app.use('/auth', auth);
app.use('/posts', posts);
app.use('/profile', profile);

app.use((req, res, next) => {
    res.status(404).render('error', {
        error: {
            status: 404,
            message: 'Page Not Found'
        }
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Something went wrong!';
    
    res.status(status).render('error', {
        error: {
            status,
            message
        }
    });
});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));