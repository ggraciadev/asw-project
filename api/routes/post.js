const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// api/post/all
router.get("/all", postController.getAll); //OK

// api/post/item
router.get("/item", postController.getById); //OK

// api/post/ask
router.get("/ask", postController.getAllAsk); //OK

// api/post/threads
router.get("/threads", postController.getAllCommentsByUsername); //OK

// api/post/submitted
router.get("/submitted", postController.getAllPostsByUsername); //OK

// api/post/likedPosts/
router.get("/likedPosts", postController.getLikedPosts); //OK

router.get("/url", postController.getByURL); //OK

// api/post/likedComments
router.get("/likedComments", postController.getLikedComments); //OK

// api/post/reply
router.get("/reply", postController.getByIdWithOneComment); //OK

// api/post/submit
router.post("/submit", postController.insertPost); //OK

// api/post/item
router.post("/item", postController.insertComment); //OK

// api/post/reply
router.post("/reply", postController.insertComment); //OK

// api/post/url
router.post("/url", postController.getByURL);

module.exports = router;