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
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 2 * 24 * 60 * 60 * 1000, // 24 hours
    });
    res.status(201).json({ user, token });
  } catch (error) {
    console.log("Database error:", error);
    return res
      .status(500)
      .json({ message: "Database error", error: error.message });
  }
};

module.exports.loginUser = async (req, res) => {
  res.send("login route");
};

module.exports.logoutUser = async (req, res) => {
  res.send("logout route");
};
