import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../emails/emailHandlers.js";
import { generateAccessToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

/**
 * GOOGLE LOGIN
 */
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });
    }

    const response = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email_verified, name, email } = response.payload;

    if (!email_verified) {
      return res
        .status(400)
        .json({ success: false, message: "Email not verified" });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const password = email + process.env.JWT_SECRET;
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      try {
        await sendWelcomeEmail(user.email);
      } catch (err) {
        console.error("Failed to send welcome email:", err);
      }
    }

    const accessToken = generateAccessToken(user.id, user.name, user.email);

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "User logged in successfully",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * SIGNUP
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.json({ success: false, message: "Missing Details" });

    if (name.length < 3)
      return res.json({
        success: false,
        message: "Name must be at least 3 characters long",
      });

    if (!email.includes("@"))
      return res.json({ success: false, message: "Invalid Email" });

    if (password.length < 6)
      return res.json({
        success: false,
        message: "Password must be at least 6 characters long",
      });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    try {
      await sendWelcomeEmail(name, email);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    res.json({ success: true, message: "User created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({
        success: false,
        message: "Email and Password are required",
      });

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user)
      return res.json({ success: false, message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.json({ success: false, message: "Invalid Email or Password" });

    const token = generateAccessToken(user.id, user.name, user.email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "User is logged in",
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * IS AUTH
 */
export const isAuth = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * LOGOUT
 */
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
  });

  res.json({ success: true, message: "Logged Out" });
};

/**
 * FORGOT PASSWORD
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    const resetUrl = `https://noteboardapp.onrender.com/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * RESET PASSWORD
 */
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { gt: new Date() },
      },
    });

    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired link" });

    if (req.body.password.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
