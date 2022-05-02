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
        let query = "select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes from comments c where c.postid = "+ row.id + " order by creationtime desc;";
        let q = await db.query(query);
        
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

const getAll = async (req, res) => {
    try {
        const orderBy = req.query.orderby;
        let query = "select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum from comments c, post p where ((p.url = '' or p.url is null) and c.postid = p.id) group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum from post p where ((p.url = '' or p.url is null) and p.id not in (select postid from comments)) order by " + orderBy + " desc;";
        
        let q = await db.query(query);

        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null, null);
            result.push(temp);
        }
        res.status(200).send(JSON.stringify(result));
    }
    catch (error) {
        res.status(500).send({error: error.toString()});
    }
}

const getAllAsk = async (req, res) => {
    try {
        const orderBy = req.query.orderby;
        let q = await db.query("select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum from comments c, post p where ((p.url = '' or p.url is null) and c.postid = p.id) group by p.id " +
                "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum from post p where ((p.url = '' or p.url is null) and p.id not in (select postid from comments)) order by " + orderBy + " desc;");
        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null, null);
            result.push(temp);
        }
        return res.status(200).send(JSON.stringify(result));
    }
    catch (error) {
        return res.status(500).send({error: error.toString()});
    }
}

const getAllCommentsByUsername = async (req,res) => {
    try {
        const user_name = req.query.username;
        const result = [];
        const q = await db.query("select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes from comments c where c.author = '" + user_name + "' order by creationtime desc;");
   
        
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
        return res.status(200).send(JSON.stringify(result));
    }
    catch (error) {
        return res.status(500).send({error: error.toString()});
    }
}

const getAllPostsByUsername = async (req,res) => {
    try {
        const user_name = req.query.username;
        let query = "select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, count(distinct c.id) as commentsnum from comments c, post p where p.username = '" + user_name + "' group by p.id " +
        "union select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 0 as commentsNum from post p where p.username = '" + user_name + "' and (p.id not in (select postid from comments)) order by creationtime desc;";

        const q = await db.query(query);
        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null, null);
            result.push(temp);
        }
        return res.status(200).send(JSON.stringify(result));
    }
    catch (error) {
        return res.status(500).send({error: error.toString()});
    }
}

const getById = async (req, res) => {
    try {
        const id = req.query.id;
        const q = await db.query("select * from Post where id=" + id + " order by likes desc");
        let rows = q.rows
        let temp = await createPostObj(rows[0], "withComments", null, null);
        return res.status(200).send(JSON.stringify(temp));

    } catch (error) {
        res.status(500).send({error: error.toString()});
    }
}

const getByIdWithOneComment = async (req, res) => {
    try {
        const id = req.query.postid;
        const commentid = req.query.commentid;
        const q = await db.query("select * from Post where id=" + id + " order by likes desc");
        let rows = q.rows
        let temp = await createPostObj(rows[0], "oneComment", commentid, null);
        return res.status(200).send(JSON.stringify(temp));

    } catch (error) {
        res.status(404).send({error: error.toString()});
    }
}

const obtainObjectByURL = async (url) => {
    try {
        if(url === null || url === '' || url === undefined) {
            console.log("CASITO UNO");
            return null;
        }
        const query = "select * from Post where url='" + url + "';";
        const q = await db.query(query);
        if(q.rows.length === 0) {
            return null;
        }
        else {
            let temp = await createPostObj(q.rows[0], "withComments", null, null);
            return temp;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Post if URL already exists, null otherwise
const getByURL = async (req, res) => {
    let result = await obtainObjectByURL(req.body.url);
    if(result == null) {
        return res.status(404).send({error: "URL not found"});
    }
    else {
        return res.status(200).send(JSON.stringify(result));
    }
}

const insertPost = async (req, res) => {
    try {
        let linkToGo = "/";
        let title = req.body.title;
        let url = "";
        if(req.body.url !== null || req.body.url !== '' || req.body.url !== undefined) {
            url = req.body.url;
        }
        let msg = req.body.msg;
        let username = req.body.username;
        let creationTime = new Date().toISOString();
        
        let post = new Post(-1, title, url, msg, 0, username, creationTime, 0, 0);

        if(post.title === undefined || post.title === ""){
            //Caso 0, no tiene titulo
            linkToGo = '/submit';
        }
        else if((post.url === "" || post.url === undefined) && (post.msg === undefined || post.msg === "")){
            //No hay url ni mensaje, no crear post
            linkToGo = '/submit';
        }
        else if((post.url === "" || post.url === undefined) && (post.msg !== "" && post.msg !== undefined)){
            //Crear un post con el mensaje y sin url
            let q = "insert into POST(title, msg, username, creationTime) values ('" + post.title +  "', '" + post.msg + "', '" + post.username + "', '" + post.creationTime + "') RETURNING *";
            linkToGo = '/item?id=' + (await db.query(q)).rows[0].id;
        }
        else if ((post.url !== "" && post.url !== undefined) && (post.msg === undefined || post.msg === "")){
            //Crear un post con el url y sin mensaje
            //If a post exists with that url, redirect to that post
            
            let postExists = await obtainObjectByURL(post.url);
            
            if(postExists === null) {
                let q = "insert into POST(title, url, username, creationTime) values ('" + post.title +  "', '" + post.url + "', '" + post.username + "', '" + post.creationTime + "') RETURNING *";
                linkToGo = '/item?id=' + (await db.query(q)).rows[0].id;
            }
            else {
                linkToGo = "/item?id=" + postExists.id;
            }
        }
        else if ((post.url !== "" ||post.url !== undefined) && (post.msg !== "" || post.msg !== undefined)){
            //Crear un post con el url y mensaje como comentario
            let postExists = await obtainObjectByURL(post.url);
            
            if(postExists === null) {
                let q = "insert into POST(title, url, username, creationTime) values ('" + post.title +  "', '" + post.url + "', '" + post.username + "', '" + post.creationTime + "') RETURNING *";
                let postID = (await db.query(q)).rows[0].id;
                linkToGo = '/item?id=' + postID;
                let q2 = "insert into comments(postid, author, creationTime, parentid, message, likes) values ('" + postID + "', '" + post.username + "', '" + post.creationTime + "', null, '" + post.msg + "', 0) RETURNING *";
                await db.query(q2);
            }
            else {
                linkToGo = "/item?id=" + postExists.id;
            }
            console.log("Caso 4");
        }
        else {
            console.log("Caso 5");
        }
        return res.status(200).send({result: "TODO PIOLA"});
    } catch (error) {
        res.status(500).send({error: error.toString()});
    }
}

const insertComment = async (req, res) => {
    try {
        let postid = req.body.postid;
        let parentid = req.body.parentid;
        let message = req.body.message;
        let username = req.body.username;
        let creationTime = new Date().toISOString();
        let likes = 0;
        let q;
        if(parentid === null || parentid === undefined) {
            q = "insert into comments(postid, author, creationTime, parentid, message, likes) values ('" + postid + "', '" + username + "', '" + creationTime + "', null, '" + message + "', '" + likes + "') RETURNING *";
        }
        else {
            q = "insert into comments(postid, author, creationTime, parentid, message, likes) values ('" + postid + "', '" + username + "', '" + creationTime + "', '" + parentid + "', '" + message + "', '" + likes + "') RETURNING *";
        }
        

        console.log(q);
        let result = await db.query(q);
        return res.status(200).send(JSON.stringify(result.rows[0]));
    }
    catch (error) {
        res.status(500).send({error: error.toString()});
    }
    

}

const getLikedComments = async (req, res) => {
    try {
        const user_name = req.query.username;
        let query = "select c.id, c.postid, c.author, c.creationtime, c.parentId, c.message, c.likes from comments c where '"+ user_name +"' in (select l.username from likecomment l where l.commentid = c.id);";
        let q = await db.query(query);
        let rows = q.rows;
        let result = [];
        let allComments = [];
        for(let i = 0; i < rows.length; ++i) {
            let temp = new Comment(rows[i].id, rows[i].postid, rows[i].author, rows[i].creationtime, rows[i].parentid, rows[i].message, rows[i].likes);
            allComments.push(temp);
        }
        let treeComments = createCommentTree(allComments);
        for(let i = 0; i < treeComments.length; ++i) {
            result.push(treeComments[i]);
        }
        return res.status(200).send(JSON.stringify(result));
    }
    catch (error) {
        res.status(404).send({error: error.toString()});
    }
}

const getLikedPosts = async (req, res) => {
    try {
        const user_name = req.query.username;
        let query = "select p.id, p.title, p.url, p.msg, p.likes, p.username, p.creationtime, 1 as userLiked from post p where '"+ user_name +"' in (select l.username from likepost l where l.postid = p.id);";
        let q = await db.query(query);
        let rows = q.rows;
        let result = [];
        
        for(let i = 0; i < rows.length; ++i) {
            let temp = await createPostObj(rows[i], "noComments", null, user_name);
            result.push(temp);
        }
        return res.status(200).send(JSON.stringify(result));
    }
    catch (error) {
        res.status(404).send({error: error.toString()});
    }
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
    insertComment,
    getLikedComments,
    getLikedPosts,
}