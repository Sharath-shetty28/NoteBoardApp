import * as userRepo from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generateToken.js";
import crypto from "crypto";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "../emails/emailHandlers.js";

export const registerUserService = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  if (name.length < 3)
    return {
      success: false,
      message: "Name must be at least 3 characters long",
    };

  if (!email.includes("@")) return { success: false, message: "Invalid Email" };

  if (password.length < 6)
    return {
      success: false,
      message: "Password must be at least 6 characters long",
    };

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) return { success: false, message: "User already exists" };

  const user = await userRepo.createUserRepo({ name, email, password });
  if (user) await sendWelcomeEmail(name, email);
  return user;
};

export const loginUserService = async (email, password) => {
  if (!email || !password) {
    throw new Error("All fields are required");
  }
  const user = await userRepo.loginUserRepo(email, password);
  if (!user) return { success: false, message: "Invalid email or password" };
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { success: false, message: "Invalid email or password" };

  const token = generateAccessToken(user.id, user.name, user.email);

  return { user, token };
};

export const isAuthService = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const user = await userRepo.isAuthRepo(userId);
  return user;
};

export const forgotPasswordService = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }
  const user = await userRepo.findUserByEmailRepo(email);
  if (!user) {
    throw new Error("User not found");
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  userRepo.passwordResetRepo(email, hashedToken);
  const resetUrl = `https://noteboardapp.onrender.com/reset-password/${resetToken}`;
  await sendPasswordResetEmail(email, resetUrl);
  return { success: true, message: "Password reset email sent" };
};

export const resetPasswordService = async (email, newPassword) => {
  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }
  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }
  const user = await userRepo.findUserByEmailRepo(email);
  if (!user) {
    throw new Error("User not found");
  }
  const result = await userRepo.resetPasswordRepo(email, newPassword);
  return result;
};
