const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./model/blog');


// express app--
const app = express();

//connect to mongodb
const dbURI = 'mongodb+srv://tbar1231:Mongo2022!!!!@sdev255group3.cpyo23q.mongodb.net/SDEV255Group3?retryWrites=true&w=majority';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true}) //<-- Stops deprication warnings.
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


app.set('view engine', 'ejs');


/*app.use((req, res) => {
    console.log('new request made');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
});*/


//middleware & static files
app.use(express('public'));
app.use(express.urlencoded({extend: true})); //For acceptihng form data.  Extended is true is an option.
app.use(morgan('dev'));


//routes
app.get('/', (req, res) => {
    res.redirect('/blogs')
    //res.sendFile('./views/index.html', {root: __dirname})  //<--The root/file/server we made.  Is this why I can't see localhost:3000?
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

app.get('/about', (req, res) => {
    res.sendFile('./views/about.html', {root: __dirname})  //<--The root/file/server we made.  Is this why I can't see localhost:3000?
});

//blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1}) //<----Sorting happens here.
        .then((result) => {
            res.render('index', {title: 'All Blogs', blogs: result})
        })
        .catch((err) => {
            console.log(err);
        });
})

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
        .then((result) => {
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err);
        }); //<-- *
}); //<-- *

app.get('/blogs/create', (req, res) => {
    const id = req.params.id;
    Blog.findById(Id)
        .then((result) => {
            res.render('details', {blog: result, title: 'Blog Details'}); 
        })
        .catch(err => {
            console.log(err);
        });
})

app.delete('/blogs/create', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
        .then(result => {
            res.json({redirect: '/blogs'})
        })
        .catch(err => {
            console.log(err);
        })
})

//Get blogs
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new Blog'});
})
//404 page--
app.use((req, res) => {
    //res.status(404).sendFile('./views/404.html', {root: __dirname})
    res.status(404).render('404', { title: '404'});
});
