const { getByUsername , likeComment, likePost, updateUser,} = require('./usersController');
const { getAll, getAllAsk, getAllCommentsByUsername, getAllPostsByUsername, getById, getByIdWithOneComment, //getByURL??????
     insertPost, insertComment, replyComment, getLikedComments, getLikedPosts, getByURL} = require('./postController');
module.exports = {
    paths: {
        '/api/user': {
            ...getByUsername,
            ...updateUser
        },
        '/api/user/voteComment': {
            ...likeComment,
        },
        '/api/user/votePost': {
            ...likePost,
        },
        '/api/post/all': {
            ...getAll,
        },
        '/api/post/item': {
            ...getById,
        },
        '/api/post/ask': {
            ...getAllAsk,
        },
        '/api/post/threads': {
            ...getAllCommentsByUsername,
        },
        '/api/post/submitted': {
            ...getAllPostsByUsername,
        },
        '/api/post/likedPosts': {
            ...getLikedPosts,
        },
        '/api/post/likedComments': {
            ...getLikedComments,
        },
        '/api/post/reply': {
            ...getByIdWithOneComment
        },
        '/api/post/url': {
            ...getByURL,
        },
        '/api/post/submit': {
            ...insertPost,
        },
        '/api/post/item': {
            ...insertComment,
        },
        '/api/post/reply': {
            ...replyComment,
        }
    }
}
            