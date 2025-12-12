//This part was implemented by Ryan
// server/middleware/userAuth.js
import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ your controllers use req.userId
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
  }
};

export default userAuth;



