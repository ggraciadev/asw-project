const db = require("./db.js");
const express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
const path = require ('path');
const app = express();
const postController = require('./controllers/postController');
const userController = require('./controllers/userController');

var session = require('express-session')

const googleApi = require('./src/google-util');


const PORT = process.env.PORT || 5000;

var currentUserLogged;

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler);
app.use(express.static(path.join(__dirname, '/public')));
var MemoryStore =session.MemoryStore;
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: true
  }));

function renderPage(res, view, layoutInfo) {
    res.render(view, layoutInfo);
};

app.get('/auth/google/callback', async function(req, res) {
    req.session.currentUserLogged = await googleApi.GetGoogleUserInfo(req.query.code);
    console.log(req.session.currentUserLogged);
    res.redirect('/');
});

app.get('/', async function(req, res) {
    const result = await postController.getAll("likes");
    //await postController.getAllCommentsByUsername('tortuga');
    renderPage(res, 'home', {layout: 'main', posts: result, loggedUser: req.session.currentUserLogged, googleURL: googleApi.GetGoogleURL()});

});

app.get('/newest', async function(req, res) {
    const result = await postController.getAll("creationtime");
    renderPage(res, 'home', {layout: 'main', posts: result});
});

app.get('/ask', async function(req, res) {
    const result = await postController.getAllAsk("likes");
    renderPage(res, 'home', {layout: 'main', posts: result});
});

app.get('/threads', async function(req, res) {
    let username = req.query.username;
    const result = await postController.getAllCommentsByUsername(username);
    console.log(result);
    renderPage(res, 'home', {layout: 'threads', posts: result});
});

app.get('/submit', async function(req, res) {
    renderPage(res, 'home', {layout: 'submit'});
});

app.post('/submit', async function(req, res) {
    let title = req.body.title.trim();
    let url = req.body.url.trim();
    let msg = req.body.msg;
    let username = 'tortuga';
    let creationTime = new Date().toISOString();
    let q = "insert into POST(title, msg, url, username, creationTime) values ('" + title + 
    "', '" + msg + "', '" + url + "', '" + username + "', '" + creationTime + "')"; 
    if(title === undefined || title === ""){
        //Aqui va una alerta en texto
        console.log("Case1");
        res.redirect('/submit');
    }
    else if(url === "" && msg === undefined){
        //Aqui va una alerta en texto
        console.log("Case2");
        res.redirect('/submit');
    }
    else if(url !== "" && msg !== ""){
        //Crear post con url y el mensaje como comment. 
        let urlPost = await postController.getByURL(url);
        
        if(urlPost === null){
            q = "insert into POST(title, url, username, creationTime) values ('" + title + 
            "', '" + url + "', '" + username + "', '" + creationTime + "')"; 
            await db.query(q);
            let post = await postController.getByURL(url);
            console.log("post: " + post);
            let q2 = "insert into COMMENTS(postid, author, creationtime, message) values ('" + post.id + 
            "', '" + username + "', '" + creationTime + "', '" + msg + "')"; 
            await db.query(q2);
            res.redirect('/item?id=' + post.id);
        }
        else {
            res.redirect('/item?id=' + urlPost.id);
        }
        console.log("Case3");
    }
    else {
        let urlPost = await postController.getByURL(url);
        console.log("urlPost: " + urlPost);
        if(urlPost === null){
            let post = await db.query(q);
            let q2 = "insert into COMMENTS(postid, author, creationtime, message) values ('" + post.id + 
            "', '" + username + "', '" + creationTime + "', '" + msg + "')"; 
            await db.query(q2);
            res.redirect('/item?id=' + post.id);
        }
        else {
            console.log("Potato: " + urlPost);
            res.redirect('/item?id=' + urlPost.id);
        }
        console.log("Case4");
    }
});


app.get('/item', async function(req, res) {
    let id = req.query.id;
    const result = await postController.getById(id);
    renderPage(res, 'home', {layout: 'item', post: result});

});

app.post('/item', async function(req, res) {
    let postId = req.query.id;
    let author = 'tortuga';
    let creationTime = new Date().toISOString();
    let message = req.body.text;
    
    let q = "insert into COMMENTS(postid, author, creationtime, message) values ('" + postId + 
    "', '" + author + "', '" + creationTime + "', '" + message + "')"; 
    
    await db.query(q);
    res.redirect("/item?id=" + postId);
});


app.get('/reply', async function(req, res) {
    let postid = req.query.postid;
    let commentid = req.query.commentid;
    const result = await postController.getByIdWithOneComment(postid, commentid);
    renderPage(res, 'home', {layout: 'reply', post: result});
});

app.post('/reply', async function(req, res) {
    let postId = req.query.postid;
    let author = 'tortuga';
    let creationTime = new Date().toISOString();
    let parentId = req.query.commentid;
    let message = req.body.text;
    
    let q = "insert into COMMENTS(postid, author, creationtime, parentid, message) values ('" + postId + 
    "', '" + author + "', '" + creationTime + "', '" + parentId + "', '" + message + "')"; 
    
    await db.query(q);
    res.redirect("/item?id=" + postId);
});


app.get('/home', async function(req, res) {
    res.redirect('/');
});

app.get('/500', function (req,res) {
    res.end('Error 500: Server error.');
});

app.get('/votePost', async function(req, res) {
    await userController.likePost(req.query.id);
    res.redirect('back');
});

app.get('/voteComment', async function(req, res) {
    await userController.likeComment(req.query.id);
    res.redirect('back');
});
 
function errorHandler (err, req, res, next) {
    res.end('error '+ err);
}

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        prettifyDate: function(timeStamp) {
            let d = new Date(timeStamp);
            d.setHours(d.getHours()+2);
            let dNow = new Date();

            let result = Math.abs(dNow - d) / 1000 / 3600;

            if(result < 0.01) {
                return "just now";
            }
            else if(result < 1) {
                let temp = (result * 60).toFixed(0);
                if(temp == 1) {
                    return temp + " minute ago";
                }
                else {
                    return temp + " minutes ago";
                }
            }
            else if(result < 24) {
                let temp = (result).toFixed(0);
                if(temp == 1) {
                    return temp + " hour ago";
                }
                else {
                    return temp + " hours ago";
                }
            }
            else {
                let temp = (result / 24).toFixed(0);
                if(temp == 1) {
                    return temp + " day ago";
                }
                else {
                    return temp + " days ago";
                }
            }
        },
        math: function(lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            
            return {
                "+": lvalue + rvalue
            }[operator];
        },
        titleURL: function(title, url) {
            if(url === ""){
                return title;
            }
            return title + " (" + url + ")";
        },
        titleOrURL: function(id, url) {
            if(url === ""){
                return ("/item?id=" + id);
            }
            return url;
        },
        getReply: function(postid, id) {
            return "/reply?postid=" + postid + "&commentid=" + id;
        },
    }
}));

app.listen(PORT);