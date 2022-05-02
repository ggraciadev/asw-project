const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// api/user/
router.get("/", userController.getByUsername); //OK

// api/user/votePost
router.get("/votePost", userController.likePost); //OK

// api/user/voteComment
router.get("/voteComment", userController.likeComment); //OK

// api/user/
router.put("/", userController.updateUser); //OK

module.exports = router;