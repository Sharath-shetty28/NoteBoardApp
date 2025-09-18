import jwt from "jsonwebtoken";

export const generateAccessToken = (userid, name, email) => {
  return jwt.sign({ userid, name, email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

