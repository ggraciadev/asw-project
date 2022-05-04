const { getByUsername , likeComment, likePost, updateUser,} = require('./usersController');
//const { getAll, getAllAsk, getAllCommentsByUsername, getAllPostsByUsername, getById, getByIdWithOneComment, getByURL, insertPost, insertComment, getLikedComments, getLikedPosts} = require('./postController');
module.exports = {
    paths: {
        '/api/user': {
            ...getByUsername,
            ...updateUser
        },
        '/api/users/voteComment': {
            ...likeComment,
        },
        '/api/users/votePost': {
            ...likePost,
        },
    }
}
