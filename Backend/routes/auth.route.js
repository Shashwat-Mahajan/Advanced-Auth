const express = require("express");
const userController = require("../controllers/auth.controller");
const middleware = require("../middleware/verifyToken")
const router = express.Router();

router.post("/signup", userController.registerUser);

router.post("/login", userController.loginUser);

router.post("/logout", userController.logoutUser);

router.post("/verify-email", userController.verifyEmail);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password/:token", userController.resetPassword);

router.post("/check-auth", middleware.verifyToken, userController.checkAuth);
module.exports = router;
