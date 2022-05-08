const { getByUsername , likeComment, likePost, updateUser,} = require('./usersController');
const { getAll, getAllAsk, getAllCommentsByUsername, getAllPostsByUsername, getById, getByIdWithOneComment, //getByURL??????
     insertPost, insertComment, replyComment, getLikedComments, getLikedPosts} = require('./postController');
module.exports = {
    paths: {
        '/api/user/': {
            ...getByUsername,
        },
        '/api/updateUser': {
            ...updateUser
        },
        '/api/users/voteComment': {
            ...likeComment,
        },
        '/api/users/votePost': {
            ...likePost,
        },
        '/api/post/all': {
            ...getAll,
        },
        '/api/post/item/': {
            ...getById,
        },
        '/api/post/ask': {
            ...getAllAsk,
        },
        '/api/post/threads/': {
            ...getAllCommentsByUsername,
        },
        '/api/post/submitted/': {
            ...getAllPostsByUsername,
        },
        '/api/post/likedPosts': {
            ...getLikedPosts,
        },
        '/api/post/likedComments': {
            ...getLikedComments,
        },
        '/api/post/reply/': {
            ...getByIdWithOneComment
        },
        '/api/post/submit': {
            ...insertPost,
        },
        '/api/post/item': {
            ...insertComment,
        },
        '/api/post/reply': {
            ...replyComment,
        },
    }
}
            