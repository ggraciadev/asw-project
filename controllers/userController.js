const db = require("../db.js");
const {Post, Comment, User} = require("../models");

const createUserObj = async (row) => {
    let obj = new User(row.username, row.email, row.pswd, row.creationtime, row.aboutme, row.phone, row.linusername, row.ghusername, row.likedComments, row.likedPosts);
    return obj;
}
async function logInGoogle(email, req) {
    let username = email.split("@")[0];
    let q = "select * from Users where username='" + username + "';";
    let result = await db.query(q);
    if(result.rows.length === 0) {
        let randomPswd = new Date().toISOString();
        let creationTime = new Date().toISOString();
        //creamos al usuario
        q = "insert into Users (email, username, pswd, creationTime) values('" + email + "', '" + username + "', '" + randomPswd + "', '" + creationTime + "');"
        result = await db.query(q);
    }
    else {
        //todo piola
    }
    req.session.currentUserLogged = username;
}

function logOut(req){
    req.session.currentUserLogged = "";
}


async function likeComment(commentId, loggedUser){
    try {
        //TODO: Substituir tortuga por usuario logado
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
    } catch (error) {
        console.log(error);
    }
}

async function likePost(postId, loggedUser){
    try {
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
    } catch (error) {
        console.log(error);
    }
}


const getAll = async (orderBy) => {
    try {
        const q = await db.query("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum from comments c, post p where c.postid = p.id group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum from post p where p.id not in (select postid from comments) order by " + orderBy + " desc;");

        let rows = q.rows;
        let result = [];

        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], false);
            result.push(temp);
        }
        return result;
    }
    catch (error) {
        console.log(error);
    }
}

const getByUsername = async (username) => {
    try {
        const q = await db.query("select * from Users where username='" + username + "';");
        let rows = q.rows
        let temp = await createUserObj(rows[0], true);

        return temp;

    } catch (error) {
        console.log(error);
    }
}

const updateUser = async (username, aboutMe, phone, linkedin, github) => {
    try {
        let q = "update Users set aboutme='" + aboutMe + "', phone='" + phone + "', linusername='" + linkedin + "', ghusername='" + github + "' where username='" + username + "';";
        await db.query(q);
        console.log(q);
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAll,
    getByUsername,
    likeComment,
    likePost,
    logInGoogle,
    updateUser,
    logOut
}