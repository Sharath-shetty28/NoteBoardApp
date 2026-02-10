import * as userService from "../services/user.service.js";

import { OAuth2Client } from "google-auth-library";

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
    const result = await userService.registerUserService(name, email, password);
    if (!result.success) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUserService(email, password);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "User logged in successfully",
      user: { email: result.user.email, name: result.user.name },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * IS AUTH
 */
export const isAuth = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const user = await userService.isAuthService(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });
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
    const user = await userService.forgotPasswordService(email);

    if (!user) return res.status(404).json({ message: "User not found" });

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
    const { email, newPassword } = req.body;

    const user = await userService.resetPasswordService(email, newPassword);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
