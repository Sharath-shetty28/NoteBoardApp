import express from "express";
import {
  isAuth,
  login,
  logout,
  signup,
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import rateLimiter from "../middleware/rateLimiter.js";

const userRouter = express.Router();

userRouter.post("/signup", rateLimiter, signup);
userRouter.post("/login", rateLimiter, login);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logout);

export default userRouter;
