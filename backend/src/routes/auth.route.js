import express from "express";
import {
  isAuth,
  login,
  logout,
  signup,
  googleLogin,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";
import authUser from "../middleware/user.middleware.js";
import rateLimiter from "../middleware/rateLimiter.middleware.js";

const userRouter = express.Router();

// userRouter.use(rateLimiter);

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/google-login", googleLogin);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.post("/logout", authUser, logout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);

export default userRouter;
