const db = require("./db.js");
const express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");
const path = require ('path');
const app = express();

const PORT = process.env.PORT || 5000

app.engine('handlebars', exphbs({
    defaultLayout: 'blog',
    helpers: {
        prettifyDate: function(timeStamp) {
            let d = new Date(timeStamp);
            let dNow = new Date();

            let result = Math.abs(dNow - d) / 1000 / 3600;

            if(result < 0.01) {
                return "Just now";
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
    }
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler);
app.use(express.static(path.join(__dirname, '/public')))

app.get('/', function(req, res) {
    db.query("select * from Post order by likes desc;", 
    [], onData, res, 'main');
    //res.end('Pagina principal ordenada por likes');

});

app.get('/home', function(req, res) {
    res.redirect('/');
});

app.get('/newest', function(req, res) {
    db.query("select * from Post order by creationTime desc;", 
    [], onData, res, 'main');
});

app.get('/submit', function(req, res) {
    renderPage(res, 'home', {layout: 'submit'});
});

app.post('/submit', function(req, res) {
    let title = req.body.title;
    let url = req.body.url.trim();
    let msg = req.body.msg;
    let username = 'tortuga';
    let creationTime = new Date().toISOString();
    let q = "insert into POST(title, msg, url, username, creationTime) values ('" + title + 
        "', '" + msg + "', '" + url + "', '" + username + "', '" + creationTime + "')"; 

    if(title.trim() === "" && (url.trim() === "" || msg === undefined)){
        //Aqui va una alerta en texto
        console.log("Not allowed to submit empty values");
        res.redirect('/submit');
    }
    else {
        db.query(q, [], onPost, res, 'main');
    }
    
    /*db.query("insert into X(x, y, z) values ('" + req.body.X + "', '" + req.body.Y + 
    "', " + req.body.Z + ");", [], onData, res, 'home');*/
});

app.get('/500', function (req,res) {
    res.end('Error 500: Server error.');
});

app.get('/item', function (req,res) {
    let id = req.url.match(/id=(.*)/)[1];
    db.query("select * from Post where id="+id+";", 
    [], onData, res, 'item');
});

 
app.get("*", function(req, res) {
    res.status(404);
    res.end('Error 404: Not found.');
 });
 
function errorHandler (err, req, res, next) {
    res.end('error '+ err);
}


function onData(err, res, data, layoutName, gameName) {
    if(!err) {
        /*
        if(data.rows.length == 0 && gameName != null) {
            res.redirect('/' + gameName);
            return;
        }
        */
        //console.log(data.rows);
        renderPage(res, 'home', {layout: layoutName, posts: data.rows});
    }
    else {
        res.status(500);
        res.redirect('/500');
        console.log("Error 500");
    }
}

function onPost(err, res, data, layoutName, gameName) {
    if(!err) {
        /*
        if(data.rows.length == 0 && gameName != null) {
            res.redirect('/' + gameName);
            return;
        }
        */
        //console.log(data.rows);
        res.redirect('/');
    }
    else {
        res.status(500);
        res.redirect('/500');
        console.log("Error 500");
    }
}

function renderPage(res, view, layoutInfo) {
    res.render(view, layoutInfo);
}

app.listen(PORT);