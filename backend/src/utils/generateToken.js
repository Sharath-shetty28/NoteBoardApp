import jwt from "jsonwebtoken";

export const generateAccessToken = (id, name, email) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};
