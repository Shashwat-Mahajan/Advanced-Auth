const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/email");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  console.log(req.body);
  console.log(name);
  console.log(email);
  console.log(password);

  try {
    const isUserAlreadyExist = await userModel.findOne({ email });
    console.log("User search result:", isUserAlreadyExist);
    console.log("Searching for email:", email);

    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await userModel.hashPassword(password);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 24 hours
    });

    await sendVerificationEmail(user.email , verificationToken);

    res.status(201).json({ user, token });
  } catch (error) {
    console.log("Database error:", error);
    return res
      .status(500)
      .json({ message: "Database error", error: error.message });
  }
};

module.exports.verifyEmail = async (req, res) => {
  const {code} = req.body;

  try{
    const user = await userModel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    })

    if(!user){
      return res.status(400).json({message: "Invalid or expired verification code"});
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({message: "Email verified successfully"});

  }catch(err){
    console.log("error in verify email:", err);
    res.status(500).json({message: "Internal server error", error: err.message});
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if(!user){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token);
    res.status(200).json({token, user});

  }catch(error){
    console.log("error in login:", error);
    res.status(500).json({message: "Internal server error", error: error.message});
  }
};


module.exports.logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({success:true, message: "Logged out successfully"});
};

module.exports.forgotPassword = async (req, res) => {
  const {email} = req.body;

  try{
    const user = await userModel.findOne({ email });
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`);

    res.status(200).json({message: "Password reset email sent successfully"});

  }catch(error){
    console.log("error in forgot password:", error);
    res.status(500).json({message: "Internal server error", error: error.message});
  }
}

module.exports.resetPassword = async (req,res) => {
  try{
    const {token} = req.params;
    const {password} = req.body;

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    });

    if(!user){
      return res.status(400).json({message: "Invalid or expired reset token"});
    }

    const hashedPassword = await userModel.hashPassword(password);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({message: "Password reset successfully"});

  }catch(error){
    console.log("error in reset password:", error);
    res.status(500).json({message: "Internal server error", error: error.message});
  }
}

module.exports.checkAuth = async (req, res) => {
  try{
    const user = req.user;
    res.status(200).json({ user });
  }catch(error){
    console.log("error in check auth:", error);
    res.status(500).json({message: "Internal server error", error: error.message});
  }
}