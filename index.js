const db = require("./db.js");
const express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
const path = require("path");
const app = express();
const postController = require("./controllers/postController");
const userController = require("./controllers/userController");

var session = require("express-session");

const googleApi = require("./src/google-util");
const { Post } = require("./models/index.js");
console.log("Server started");

const PORT = process.env.PORT || 5000;

var currentUserLogged;

app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler);
app.use(express.static(path.join(__dirname, "/public")));
var MemoryStore = session.MemoryStore;
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: true,
  })
);

function renderPage(res, view, layoutInfo) {
  res.render(view, layoutInfo);
}

app.get("/auth/google/callback", async function (req, res) {
  let email = await googleApi.GetGoogleUserInfo(req.query.code);
  await userController.logInGoogle(email, req);
  res.redirect("/");
});

app.get("/", async function (req, res) {
  const result = await postController.getAll(
    "likes",
    req.session.currentUserLogged
  );
  //await postController.getAllCommentsByUsername('tortuga');
  renderPage(res, "home", {
    layout: "main",
    posts: result,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.get("/newest", async function (req, res) {
  const result = await postController.getAll(
    "creationtime",
    req.session.currentUserLogged
  );
  renderPage(res, "home", {
    layout: "main",
    posts: result,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.get("/logout", function(req, res){
  userController.logOut(req);
  res.redirect("/");
});

app.get("/ask", async function (req, res) {
  const result = await postController.getAllAsk(
    "likes",
    req.session.currentUserLogged
  );
  renderPage(res, "home", {
    layout: "main",
    posts: result,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.get("/threads", async function (req, res) {
  let username = req.query.username;
  const result = await postController.getAllCommentsByUsername(username);
  renderPage(res, "home", {
    layout: "threads",
    posts: result,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.get("/submitted", async function (req, res) {
  let username = req.query.username;
  const result = await postController.getAllPostsByUsername(username);
  renderPage(res, "home", {
    layout: "main",
    posts: result,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.get("/submit", async function (req, res) {
  renderPage(res, "home", {
    layout: "submit",
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.get("/user", async function (req, res) {
  let id = req.query.username;
  console.log("id: " + id);
  const user = await userController.getByUsername(id);
  console.log("user:");
  console.log(user);
  
  renderPage(res, "home", {
    layout: "user",
    user: user,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.get("/profile", async function (req, res) {
  const user = await userController.getByUsername(req.session.currentUserLogged);
  renderPage(res, "home", {
    layout: "profile",
    user: user,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.post("/submit", async function (req, res) {
  let title = req.body.title.trim();
  let url = req.body.url.trim();
  let msg = req.body.msg;
  let username = req.session.currentUserLogged;
  let creationTime = new Date().toISOString();
  let post = new Post(-1, title, url, msg, 0, username, creationTime, 0, 0);
  let linkToGo = await postController.insertPost(post);
  res.redirect(linkToGo);
});

app.post("/profile", async function (req, res) {
  let aboutMe = req.body.aboutMe.trim();
  let phone = req.body.phone.trim();
  let linkedin = req.body.linkedin.trim();
  let github = req.body.github.trim();
  let user = req.session.currentUserLogged;
  await userController.updateUser(user, aboutMe, phone, linkedin, github);  
  res.redirect("/profile?username=" + user);
});

app.get("/item", async function (req, res) {
  let id = req.query.id;
  const result = await postController.getById(
    id,
    req.session.currentUserLogged
  );
  renderPage(res, "home", {
    layout: "item",
    post: result,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.post("/item", async function (req, res) {
  let postId = req.query.id;
  let author = req.session.currentUserLogged;
  let creationTime = new Date().toISOString();
  let message = req.body.text;

  let q =
    "insert into COMMENTS(postid, author, creationtime, message) values ('" +
    postId +
    "', '" +
    author +
    "', '" +
    creationTime +
    "', '" +
    message +
    "')";

  await db.query(q);
  res.redirect("/item?id=" + postId);
});

app.get("/reply", async function (req, res) {
  let postid = req.query.postid;
  let commentid = req.query.commentid;
  const result = await postController.getByIdWithOneComment(
    postid,
    commentid,
    req.session.currentUserLogged
  );
  renderPage(res, "home", {
    layout: "reply",
    post: result,
    loggedUser: req.session.currentUserLogged,
    googleURL: googleApi.GetGoogleURL(),
  });
});

app.post("/reply", async function (req, res) {
  let postId = req.query.postid;
  let author = req.session.currentUserLogged;
  let creationTime = new Date().toISOString();
  let parentId = req.query.commentid;
  let message = req.body.text;

  let q =
    "insert into COMMENTS(postid, author, creationtime, parentid, message) values ('" +
    postId +
    "', '" +
    author +
    "', '" +
    creationTime +
    "', '" +
    parentId +
    "', '" +
    message +
    "')";

  await db.query(q);
  res.redirect("/item?id=" + postId);
});

app.get("/home", async function (req, res) {
  res.redirect("/");
});

app.get("/500", function (req, res) {
  res.end("Error 500: Server error.");
});

app.get("/votePost", async function (req, res) {
  await userController.likePost(req.query.id, req.session.currentUserLogged);
  res.redirect("back");
});

app.get("/voteComment", async function (req, res) {
  await userController.likeComment(req.query.id, req.session.currentUserLogged);
  res.redirect("back");
});

function errorHandler(err, req, res, next) {
  res.end("error " + err);
}

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    helpers: {
      prettifyDate: function (timeStamp) {
        let d = new Date(timeStamp);
        d.setHours(d.getHours() + 2);
        let dNow = new Date();

        let result = Math.abs(dNow - d) / 1000 / 3600;

        if (result < 0.01) {
          return "just now";
        } else if (result < 1) {
          let temp = (result * 60).toFixed(0);
          if (temp == 1) {
            return temp + " minute ago";
          } else {
            return temp + " minutes ago";
          }
        } else if (result < 24) {
          let temp = result.toFixed(0);
          if (temp == 1) {
            return temp + " hour ago";
          } else {
            return temp + " hours ago";
          }
        } else {
          let temp = (result / 24).toFixed(0);
          if (temp == 1) {
            return temp + " day ago";
          } else {
            return temp + " days ago";
          }
        }
      },
      math: function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
          "+": lvalue + rvalue,
        }[operator];
      },
      titleURL: function (title, url) {
        if (url === "") {
          return title;
        }
        return title + " (" + url + ")";
      },
      titleOrURL: function (id, url) {
        if (url === "") {
          return "/item?id=" + id;
        }
        return url;
      },
      getReply: function (postid, id) {
        return "/reply?postid=" + postid + "&commentid=" + id;
      },
      truncate: function (mail){
        return mail.split("@")[0];
      }
    },
  })
);

app.listen(PORT);
