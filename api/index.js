const db = require("./db.js");
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const path = require("path");

const {User, Auth, Post} = require("./routes");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler);
app.use(express.static(path.join(__dirname, "/public")));
function errorHandler(err, req, res, next) {
    res.end("error " + err);
}

app.use("/api/user", User);
app.use("/api/post", Post);

app.listen(PORT);
console.log("Server started at port " + PORT);