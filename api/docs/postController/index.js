const getAll = require('./getAll');
const getById = require('./getById');
const getAllAsk = require('./getAllAsk');
const getAllCommentsByUsername = require('./getAllCommentsByUsername');
const getAllPostsByUsername = require('./getAllPostsByUsername');
const getLikedPosts = require('./getLikedPosts');
const getLikedComments = require('./getLikedComments');
const getByIdWithOneComment = require('./getByIdWithOneComment');
const insertPost = require('./insertPost');
const insertComment = require('./insertComment');
const replyComment = require('./replyComment');

module.exports = {
    getAll: getAll,
    getById: getById,
    getAllAsk: getAllAsk,
    getAllCommentsByUsername: getAllCommentsByUsername,
    getAllPostsByUsername: getAllPostsByUsername,
    getLikedPosts: getLikedPosts,
    getLikedComments: getLikedComments,
    getByIdWithOneComment: getByIdWithOneComment,
    insertPost: insertPost,
    insertComment: insertComment,
    replyComment: replyComment,
}
