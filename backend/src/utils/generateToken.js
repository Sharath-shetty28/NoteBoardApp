import jwt from "jsonwebtoken";

export const generateAccessToken = (userid, name, email) => {
  return jwt.sign({ userid, name, email }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};
