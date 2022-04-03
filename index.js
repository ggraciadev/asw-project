const db = require("./db.js");
const express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
const path = require ('path');
const app = express();
const postController = require('./controllers/postController');

const PORT = process.env.PORT || 5000;

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler);
app.use(express.static(path.join(__dirname, '/public')))

function renderPage(res, view, layoutInfo) {
    res.render(view, layoutInfo);
}

app.get('/', async function(req, res) {
    //console.log("holi");
    const result = await postController.getAll("likes");
    renderPage(res, 'home', {layout: 'main', posts: result});

});

app.get('/newest', async function(req, res) {
    const result = await postController.getAll("creationtime");
    renderPage(res, 'home', {layout: 'main', posts: result});
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
        console.log("Title needed");
        res.redirect('/submit');
    }
    else if(url === "" && msg === undefined){
        //Aqui va una alerta en texto
        console.log("MSG or URL needed1");
        res.redirect('/submit');
    }
    else if(url !== "" && msg !== ""){
        //Aqui va una alerta en texto
        console.log("MSG or URL needed2");
        res.redirect('/submit');
    }
    else {
        await db.query(q);
        res.redirect('/newest');
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


app.get('/home', async function(req, res) {
    res.redirect('/');
});

app.get('/500', function (req,res) {
    res.end('Error 500: Server error.');
});
 
function errorHandler (err, req, res, next) {
    res.end('error '+ err);
}

async function likeComment(commentId){
    let q = "update COMMENTS set likes = likes + 1 where id = " + commentId;
    await db.query(q);
}

app.engine('handlebars', exphbs({
    defaultLayout: 'blog',
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
        getReply: function(postid, id) {
            return "/reply?postid=" + postid + "&commentid=" + id;
        },
    }
}));

app.listen(PORT);