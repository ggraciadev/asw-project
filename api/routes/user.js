const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");

// api/user/
router.get("/", userController.getByUsername); //OK

// api/user/votePost
router.put("/votePost", userController.likePost); //OK

// api/user/voteComment
router.put("/voteComment", userController.likeComment); //OK

// api/user/
router.put("/", userController.updateUser); //OK

module.exports = router;