import express from "express";
import {
  isAuth,
  login,
  logout,
  signup,
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/is-auth", authUser, isAuth);
userRouter.get("/logout", authUser, logout);

export default userRouter;
