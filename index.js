const db = require("./db.js");
const express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require("body-parser");

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
        }
    }
}));

app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler);

app.get('/', function(req, res) {
    console.log("Estoy dentro de home");
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
    let url = req.body.url;
    let body = req.body.body;
    let username = 'tortuga';
    let creationTime = new Date().toISOString();
    let q = "insert into POST(title, msg, url, username, creationTime) values ('" + title + 
        "', '" + body + "', '" + url + "', '" + username + "', '" + creationTime + "')";
        
    console.log("query: " + q);
        
    res.redirect('/home');
    /*db.query("insert into X(x, y, z) values ('" + req.body.X + "', '" + req.body.Y + 
    "', " + req.body.Z + ");", [], onData, res, 'home');*/

    //aqui pillaremos la info del formulario y haremos un insert en la base de datos
});

app.get('/422', function (req, res) {
    res.end('Error 422. Nom de jugador o la puntuació no ha estat definida.');
});

app.get('/500', function (req,res) {
    res.end('Error 500. Error al servidor.');
});

app.get('/:app_codi', function(req,res) {
    if(req.params.app_codi == "favicon.ico") return;
    
    db.query( "select rec.player, rec.score, rec.datetime as date from record rec where rec.app_code = '" + req.params.app_codi + "' order by rec.score desc;"
        ,[], onData, res, 'scores', req.params.app_codi);
});


app.post('/:app_codi', function (req,res) {
    console.log(req);
    if(req.params.app_codi == "favicon.ico") return;
    if(!req.body.Name || !req.body.Score) {
        res.status(422);
        console.log("Error 422");
        res.redirect('/422');
        return;
    }
    db.query("insert into record(app_code, player, score) values ('" + req.params.app_codi + "', '" + req.body.Name + 
    "', " + req.body.Score + ");", [], onData, res, 'scores', req.params.app_codi );
});

app.get("/error", function(req, res, next){
    next("Error porquesi");
});
 
app.get("*", function(req, res) {
    res.status(404);
    res.end('Error 404: No es troba la pagina solicitada.');
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
        console.log(data.rows);
        renderPage(res, 'home', {layout: layoutName, posts: data.rows});
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