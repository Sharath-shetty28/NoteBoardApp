import jwt from "jsonwebtoken";

export const generateAccessToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};
