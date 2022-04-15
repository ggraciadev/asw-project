const db = require("../db.js");
const {Post, Comment, User} = require("../models");

const createUserObj = async (row) => {
    let obj = new User(row.username, row.password, row.likedComments, row.likedPosts);
    console.log(obj);
    return obj;
}
async function logInGoogle(email, req) {
    let q = "select * from Users where username='" + email + "';";
    let result = await db.query(q);
    if(result.rows.length === 0) {
        let randomPswd = new Date().toISOString();
        //creamos al usuario
        q = "insert into Users (username, pswd) values('" + email + "', '" + randomPswd + "');"
        result = await db.query(q);
    }
    else {
        //todo piola
    }
    req.session.currentUserLogged = email;
    console.log(email + " has logged in");
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

const getById = async (id) => {
    try {
        const q = await db.query("select * from Post where id=" + id + " order by likes desc");
        let rows = q.rows
        let temp = await createPostObj(rows[0], true);
        console.log(temp);
        return temp;

    } catch (error) {
        console.log(error);
    }
}

//Post if URL already exists, null otherwise
const getByURL = async (url) => {
    try {
        const q = await db.query("select * from Post where url='" + url + "';");
        if(q.rows.length === 0) {
            return null;
        }
        else {
            let temp = await createPostObj(q.rows[0], true);
            return temp;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAll,
    getById,
    getByURL,
    likeComment,
    likePost,
    logInGoogle
}