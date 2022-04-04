const db = require("../db.js");
const {Post, Comment} = require("../models");

const createPostObj = async (row, withComments) => {
    let obj = new Post(row.id, row.title, row.url, row.msg, row.likes, row.username, row.creationtime, row.commentsnum, row.userliked);

    if(withComments) {
        const q = await db.query("select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes, 1 as userLiked from comments c where c.postid = "+ row.id +" and 'tortuga' in (select l.username from likecomment l where l.commentid = c.id) " +
        "union select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes, 0 as userLiked from comments c where c.postid = "+ row.id +" and 'tortuga' not in (select l.username from likecomment l where l.commentid = c.id) order by creationtime desc;")
        let rows = q.rows;
        for(let i = 0; i < rows.length; ++i) {
            let temp = new Comment(rows[i].id, rows[i].postid, rows[i].author, rows[i].creationtime, rows[i].parentid, rows[i].message, rows[i].likes, rows[i].userliked);
            obj.comments.push(temp);
        }
        obj.commentsNum = obj.comments.length;
    }
    return obj;
}

const getAll = async (orderBy) => {
    try {

        /*
        console.log("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 0 as userLiked from comments c, post p where (c.postid = p.id and 'tortuga' not in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 0 as userLiked from post p where (p.id not in (select postid from comments) and 'tortuga' not in (select l.username from likepost l where l.postid = p.id)) " + 
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 1 as userLiked from comments c, post p where (c.postid = p.id and 'tortuga' in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 1 as userLiked from post p where (p.id not in (select postid from comments) and 'tortuga' in (select l.username from likepost l where l.postid = p.id)) order by " + orderBy + " desc;");
        */
        const q = await db.query("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 0 as userLiked from comments c, post p where (c.postid = p.id and 'tortuga' not in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 0 as userLiked from post p where (p.id not in (select postid from comments) and 'tortuga' not in (select l.username from likepost l where l.postid = p.id)) " + 
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 1 as userLiked from comments c, post p where (c.postid = p.id and 'tortuga' in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 1 as userLiked from post p where (p.id not in (select postid from comments) and 'tortuga' in (select l.username from likepost l where l.postid = p.id)) order by " + orderBy + " desc;");


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
}