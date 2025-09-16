import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not Authenticated" });

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized" });
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authUser;
