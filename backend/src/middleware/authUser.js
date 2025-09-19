
import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  try {
    let token;

    // 1️⃣ check cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // 2️⃣ check Authorization header ("Bearer <token>")
    else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user
    if (!decoded?.id) {
      return res.status(401).json({ message: "Token is not valid" });
    }
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default authUser;
