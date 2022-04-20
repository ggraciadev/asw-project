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


const createPostObj = async (row, withComments, commentID, loggedUser) => {
    let obj = new Post(row.id, row.title, row.url, row.msg, row.likes, row.username, row.creationtime, row.commentsnum, row.userliked);

    if(withComments == "withComments") {
        const q = await db.query("select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes, 1 as userLiked from comments c where c.postid = "+ row.id +" and '" + loggedUser + "' in (select l.username from likecomment l where l.commentid = c.id) " +
        "union select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes, 0 as userLiked from comments c where c.postid = "+ row.id +" and '" + loggedUser + "' not in (select l.username from likecomment l where l.commentid = c.id) order by creationtime desc;")
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

const getAll = async (orderBy, loggedUser) => {
    try {
        const q = await db.query("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 0 as userLiked from comments c, post p where (c.postid = p.id and '" + loggedUser + "' not in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 0 as userLiked from post p where (p.id not in (select postid from comments) and '" + loggedUser + "' not in (select l.username from likepost l where l.postid = p.id)) " + 
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 1 as userLiked from comments c, post p where (c.postid = p.id and '" + loggedUser + "' in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 1 as userLiked from post p where (p.id not in (select postid from comments) and '" + loggedUser + "' in (select l.username from likepost l where l.postid = p.id)) order by " + orderBy + " desc;");

        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null, loggedUser);
            result.push(temp);
        }
        return result;
    }
    catch (error) {
        console.log(error);
    }
}

const getAllAsk = async (orderBy, loggedUser) => {
    try {
        const q = await db.query("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 0 as userLiked from comments c, post p where (p.url = '' and c.postid = p.id and '" + loggedUser + "' not in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 0 as userLiked from post p where (p.url = '' and p.id not in (select postid from comments) and '" + loggedUser + "' not in (select l.username from likepost l where l.postid = p.id)) " + 
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 1 as userLiked from comments c, post p where (p.url = '' and c.postid = p.id and '" + loggedUser + "' in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 1 as userLiked from post p where (p.url = '' and p.id not in (select postid from comments) and '" + loggedUser + "' in (select l.username from likepost l where l.postid = p.id)) order by " + orderBy + " desc;");
        
        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null, loggedUser);
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
        const q = await db.query("select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes, 1 as userLiked from comments c where c.author = '" + username + "' and '" + username + "' in (select l.username from likecomment l where l.commentid = c.id)" +
        "union select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes, 0 as userLiked from comments c where c.author = '" + username + "' and '" + username + "' not in (select l.username from likecomment l where l.commentid = c.id) order by creationtime desc;");
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
        return result;
    }
    catch (error) {
        console.log(error);
    }
}

const getAllPostsByUsername = async (loggedUser) => {
    try {
        const q = await db.query("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 0 as userLiked from comments c, post p where p.username = '" + loggedUser + "' and (c.postid = p.id and '" + loggedUser + "' not in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 0 as userLiked from post p where p.username = '" + loggedUser + "' and (p.id not in (select postid from comments) and '" + loggedUser + "' not in (select l.username from likepost l where l.postid = p.id)) " + 
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum, 1 as userLiked from comments c, post p where p.username = '" + loggedUser + "' and (c.postid = p.id and '" + loggedUser + "' in (select l.username from likepost l where l.postid = p.id)) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum, 1 as userLiked from post p where p.username = '" + loggedUser + "' and (p.id not in (select postid from comments) and '" + loggedUser + "' in (select l.username from likepost l where l.postid = p.id)) order by creationtime desc;");

        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null, loggedUser);
            result.push(temp);
        }
        return result;
    }
    catch (error) {
        console.log(error);
    }
}

const getById = async (id, loggedUser) => {
    try {
        const q = await db.query("select * from Post where id=" + id + " order by likes desc");
        let rows = q.rows
        let temp = await createPostObj(rows[0], "withComments", null, loggedUser);
        return temp;

    } catch (error) {
        console.log(error);
    }
}

const getByIdWithOneComment = async (id, commentid, loggedUser) => {
    try {
        const q = await db.query("select * from Post where id=" + id + " order by likes desc");
        let rows = q.rows
        let temp = await createPostObj(rows[0], "oneComment", commentid, loggedUser);
        return temp;

    } catch (error) {
        console.log(error);
    }
}

//Post if URL already exists, null otherwise
const getByURL = async (url, loggedUser) => {
    try {
        if(url === null || url === '') {
            return null;
        }
        const q = await db.query("select * from Post where url='" + url + "';");
        if(q.rows.length === 0) {
            return null;
        }
        else {
            let temp = await createPostObj(q.rows[0], "withComments", null, loggedUser);
            return temp;
        }
    } catch (error) {
        console.log(error);
    }
}

const insertPost = async (post) => {
    let q = "insert into POST(title, msg, url, username, creationTime) values ('" + post.title + 
    "', '" + post.msg + "', '" + post.url + "', '" + post.username + "', '" + post.creationTime + "') RETURNING *"; 
    let linkToGo = "";
    if(post.title === undefined || post.title === ""){
        //Aqui va una alerta en texto
        console.log("Case1");
        linkToGo = '/submit';
    }
    else if(post.url === "" && post.msg === undefined){
        //Aqui va una alerta en texto
        console.log("Case2");
        linkToGo = '/submit';
    }
    else if(post.url !== "" && post.msg !== ""){
        //Crear post con url y el mensaje como comment. 
        let urlPost = await getByURL(post.url, post.username);
        
        if(urlPost === null){
            q = "insert into POST(title, url, username, creationTime) values ('" + post.title + 
            "', '" + post.url + "', '" + post.username + "', '" + post.creationTime + "') RETURNING *"; 
            await db.query(q);
            let tempPost = await getByURL(post.url, post.username);
            console.log("post: " + tempPost);
            let q2 = "insert into COMMENTS(postid, author, creationtime, message) values ('" + tempPost.rows[0].id + 
            "', '" + post.username + "', '" + post.creationTime + "', '" + post.msg + "')"; 
            await db.query(q2);
            linkToGo = '/item?id=' + tempPost.rows[0].id;
        }
        else {
            linkToGo = '/item?id=' + urlPost.id;
        }
        console.log("Case3");
    }
    else {
        let urlPost = await getByURL(post.url, post.username);
        console.log("urlPost: " + urlPost);
        if(urlPost === null){
            let tempPost = await db.query(q);
            let q2 = "insert into COMMENTS(postid, author, creationtime, message) values ('" + tempPost.rows[0].id + 
            "', '" + post.username + "', '" + post.creationTime + "', '" + post.msg + "')"; 
            await db.query(q2);
            linkToGo = '/item?id=' + tempPost.rows[0].id;
        }
        else {
            console.log("Potato: " + urlPost);
            linkToGo = '/item?id=' + urlPost.id;
        }
        console.log("Case4");
    }
    return linkToGo;
}

module.exports = {
    getAll,
    getAllAsk,
    getAllCommentsByUsername,
    getAllPostsByUsername,
    getById,
    getByIdWithOneComment,
    getByURL,
    insertPost,

}