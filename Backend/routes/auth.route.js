const express = require("express");
const userController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/logout", userController.logoutUser);

router.post("/verify-email", userController.verifyEmail);

module.exports = router;
