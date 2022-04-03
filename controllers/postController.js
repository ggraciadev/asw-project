const { rows } = require("pg/lib/defaults");
const db = require("../db.js");
const Post = require("../models/post.js");
const Comment = require("../models/comment.js");

const createPostObj = async (row, withComments) => {
    let obj = new Post(row.id, row.title, row.url, row.msg, row.likes, row.username, row.creationtime, row.commentsnum);
    if(withComments) {
        const q = await db.query("select * from Comments where postid=" + row.id + " order by creationtime desc");

        let rows = q.rows;
        for(let i = 0; i < rows.length; ++i) {
            let temp = new Comment(rows[i].id, rows[i].postid, rows[i].author, rows[i].creationtime, rows[i].parentid, rows[i].message, rows[i].likes);
            obj.comments.push(temp);
        }
        obj.commentsNum = obj.comments.length;
    }
    console.log(obj);
    return obj;
}

/* async function likeComment(commentId){
    let q = "update COMMENTS set likes = likes + 1 where id = " + commentId;
    await db.query(q);
} */

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

module.exports = {
    getAll,
    getById,
}