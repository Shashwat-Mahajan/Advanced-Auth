const jwt = require("jsonwebtoken");

module.exports.verifyToken = async (req,res,next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

    
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) ||
      req.cookies.token;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        if(!user){
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = user;
        next(); 
        return res.status(200).json({ user });
    }catch(error){
        return res.status(401).json({ message: "Unauthorized" });
    }
}