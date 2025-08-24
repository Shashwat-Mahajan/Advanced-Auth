const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model"); // make sure to import

module.exports.verifyToken = async (req, res, next) => {
  const token = req.cookies?.token; // safer access

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // attach user to request
    next(); // pass control to next middleware / route handler
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
