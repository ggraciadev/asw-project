const db = require("../db.js");
const {Post, Comment} = require("../models");



const createCommentTreeRec = (comments, comment) => {
    for(let i = 0; i < comments.length; i++) {
        if(comments[i].parentID === comment.id && comments[i].id !== comment.id) {
            comment.comments.push(createCommentTreeRec(comments, comments[i]));
        }
    }
    return comment;
}

const createCommentTree = (comments) => {
    let result = [];
    for(let i = 0; i < comments.length; ++i) {
        if(comments[i].parentID === null)  {
            comments[i] = (createCommentTreeRec(comments, comments[i]));
            result.push(comments[i]);
        }
    }
    return result;
}


const createPostObj = async (row, withComments, commentID) => {
    let obj = new Post(row.id, row.title, row.url, row.msg, row.likes, row.username, row.creationtime, row.commentsnum, row.userliked);

    if(withComments == "withComments") {
        const q = await db.query("select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes, 1 as userLiked from comments c where c.postid = "+ row.id +" and 'tortuga' in (select l.username from likecomment l where l.commentid = c.id) " +
        "union select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes, 0 as userLiked from comments c where c.postid = "+ row.id +" and 'tortuga' not in (select l.username from likecomment l where l.commentid = c.id) order by creationtime desc;")
        let rows = q.rows;
        let allComments = [];
        for(let i = 0; i < rows.length; ++i) {
            let temp = new Comment(rows[i].id, rows[i].postid, rows[i].author, rows[i].creationtime, rows[i].parentid, rows[i].message, rows[i].likes, rows[i].userliked);
            allComments.push(temp);
        }
        let treeComments = createCommentTree(allComments);
        for(let i = 0; i < treeComments.length; ++i) {
            obj.comments.push(treeComments[i]);
        }
    }
    else if(withComments == "oneComment") {
        const q = await db.query("select * from comments where id = "+ commentID +";");
        let temp = new Comment(q.rows[0].id, q.rows[0].postid, q.rows[0].author, q.rows[0].creationtime, q.rows[0].parentid, q.rows[0].message, q.rows[0].likes, 0);
        obj.comments.push(temp);
    }

    return obj;
}

const getAll = async (orderBy) => {
    try {
        const q = await db.query("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 0 as userLiked from comments c, post p where (c.postid = p.id and 'tortuga' not in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 0 as userLiked from post p where (p.id not in (select postid from comments) and 'tortuga' not in (select l.username from likepost l where l.postid = p.id)) " + 
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 1 as userLiked from comments c, post p where (c.postid = p.id and 'tortuga' in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 1 as userLiked from post p where (p.id not in (select postid from comments) and 'tortuga' in (select l.username from likepost l where l.postid = p.id)) order by " + orderBy + " desc;");
        
        
        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null);
            result.push(temp);
        }
        return result;
    }
    catch (error) {
        console.log(error);
    }
}

const getAllAsk = async (orderBy) => {
    try {
        const q = await db.query("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 0 as userLiked from comments c, post p where (p.url = '' and c.postid = p.id and 'tortuga' not in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 0 as userLiked from post p where (p.url = '' and p.id not in (select postid from comments) and 'tortuga' not in (select l.username from likepost l where l.postid = p.id)) " + 
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 1 as userLiked from comments c, post p where (p.url = '' and c.postid = p.id and 'tortuga' in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 1 as userLiked from post p where (p.url = '' and p.id not in (select postid from comments) and 'tortuga' in (select l.username from likepost l where l.postid = p.id)) order by " + orderBy + " desc;");
        
        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null);
            result.push(temp);
        }
        return result;
    }
    catch (error) {
        console.log(error);
    }
}

const getAllCommentsByUsername = async (username) => {
    try {
        const result = [];
        const q = await db.query("select * from comments where author = '"+ username +"';");
        let rows = q.rows;
        let allComments = [];
        for(let i = 0; i < rows.length; ++i) {
            let temp = new Comment(rows[i].id, rows[i].postid, rows[i].author, rows[i].creationtime, rows[i].parentid, rows[i].message, rows[i].likes, rows[i].userliked);
            allComments.push(temp);
        }
        let treeComments = createCommentTree(allComments);
        for(let i = 0; i < treeComments.length; ++i) {
            result.push(treeComments[i]);
        }
        console.log(result);
    }
    catch (error) {
        console.log(error);
    }
}


const getById = async (id) => {
    try {
        const q = await db.query("select * from Post where id=" + id + " order by likes desc");
        let rows = q.rows
        let temp = await createPostObj(rows[0], "withComments", null);
        return temp;

    } catch (error) {
        console.log(error);
    }
}

const getByIdWithOneComment = async (id, commentid) => {
    try {
        const q = await db.query("select * from Post where id=" + id + " order by likes desc");
        let rows = q.rows
        let temp = await createPostObj(rows[0], "oneComment", commentid);
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
            let temp = await createPostObj(q.rows[0], "withComments", null);
            return temp;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getAll,
    getAllAsk,
    getAllCommentsByUsername,
    getById,
    getByIdWithOneComment,
    getByURL,
}