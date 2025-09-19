import express from "express";
import {
  isAuth,
  login,
  logout,
  signup,
  googleLogin
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import rateLimiter from "../middleware/rateLimiter.js";



const userRouter = express.Router();

userRouter.post("/signup", rateLimiter, signup);
userRouter.post("/login", rateLimiter, login);
userRouter.post("/google-login", googleLogin);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.post("/logout", authUser, logout);

export default userRouter;




