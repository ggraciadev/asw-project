const db = require("../db.js");
const {User} = require("../models");

const createUserObj = async (row) => {
    let obj = new User(row.username, row.email, row.pswd, row.creationtime, row.aboutme, row.phone, row.linusername, row.ghusername, row.apikey, row.likedComments, row.likedPosts);
    console.log(obj);
    return obj;
}

async function likeComment(req, res){
    try {
        let user = await getByUsernameAux(req.query.username);
        if(req.body.apikey == null || req.body.apikey == '' || req.body.apikey == undefined ||
            req.body.apikey != user.apikey) { 
            res.status(403).send({error: "Not authorized"});
            return;
        }
        let commentId = req.query.commentid;
        let loggedUser = req.query.username;
        let qAllUserLikes = "select commentid from likeComment where commentid=" + commentId + " and username='" + loggedUser + "';";
        let qAllUserLikesResult = await db.query(qAllUserLikes);
        let hasLiked = false;
        let q, q2;
        for(let i = 0; i < qAllUserLikesResult.rows.length; ++i) {
            if(qAllUserLikesResult.rows[i].commentid == commentId) {
                hasLiked = true;
                break;
            }
        }
        if(hasLiked) {
            q = "update comments set likes=likes-1 where id=" + commentId + ";";
            q2 = "delete from likeComment where commentid=" + commentId + " and username='" + loggedUser + "';";
        }
        else {
            q = "update comments set likes=likes+1 where id=" + commentId + ";";
            q2 = "insert into likeComment values('" + loggedUser + "', " + commentId + ");";

        }
        await db.query(q);
        await db.query(q2);
        res.status(200).send({liked: (!hasLiked).toString()});
    } catch (error) {
        res.status(500).send({error: error.toString()});
    }
}

async function likePost(req, res){
    try {
        let user = await getByUsernameAux(req.query.username);
        if(req.body.apikey == null || req.body.apikey == '' || req.body.apikey == undefined ||
            req.body.apikey != user.apikey) { 
            res.status(403).send({error: "Not authorized"});
            return;
        }
        let postId = req.query.postid;
        let loggedUser = req.query.username;
        //TODO: Substituir tortuga por usuario logado
        let qAllUserLikes = "select postid from likePost where postid=" + postId + " and username='" + loggedUser + "';";
        let qAllUserLikesResult = await db.query(qAllUserLikes);
        let hasLiked = false;
        let q, q2;
        for(let i = 0; i < qAllUserLikesResult.rows.length; ++i) {
            if(qAllUserLikesResult.rows[i].postid == postId) {
                hasLiked = true;
                break;
            }
        }
        if(hasLiked) {
            q = "update post set likes=likes-1 where id=" + postId + ";";
            q2 = "delete from likePost where postid=" + postId + " and username='" + loggedUser + "';";
            

        }
        else {
            q = "update post set likes=likes+1 where id=" + postId + ";";
            q2 = "insert into likePost values('" + loggedUser + "', " + postId + ");";
        }
        await db.query(q);
        await db.query(q2);
        res.status(200).send({liked: (!hasLiked).toString()});
    } catch (error) {
        res.status(500).send({error: error.toString()});
    }
}

const getByUsernameAux = async(username) => {
    try {
        const q = await db.query("select * from Users where username='" + username + "';");
        let rows = q.rows
        let temp = await createUserObj(rows[0], true);

        return temp;

    } catch (error) {
        console.log({error: error.toString()});
    }
}

const getByUsername = async (req,res) => {
    let username = req.query.username;
    try {
        const q = await db.query("select * from Users where username='" + username + "';");
        let rows = q.rows
        let temp = await createUserObj(rows[0], true);

        return res.status(200).send({user: temp});

    } catch (error) {
        res.status(500).send({error: error.toString()});
    }
}

const updateUser = async (req, res) => {
    
    let username = req.body.username;
    let aboutMe = req.body.aboutme;
    let phone = req.body.phone;
    let linkedin = req.body.linkedin;
    let github = req.body.github;
    console.log("UPDATE");
    try {
        let user = await getByUsernameAux(req.body.username);
        if(req.body.apikey == null || req.body.apikey == '' || req.body.apikey == undefined ||
            req.body.apikey != user.apikey) { 
            res.status(403).send({error: "Not authorized"});
            return;
        }
        let q = "update Users set aboutme='" + aboutMe + "', phone='" + phone + "', linusername='" + linkedin + "', ghusername='" + github + "' where username='" + username + "' RETURNING *;";
        console.log(q);
        let result = await db.query(q);
        return res.status(200).send({user: result.rows[0]});
    }
    catch (error) {
        res.status(500).send({error: error.toString()});
    }
}

module.exports = {
    getByUsername,
    likeComment,
    likePost,
    updateUser,
    getByUsernameAux,
}