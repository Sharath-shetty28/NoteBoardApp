import prisma from "../config/db.js";
import bcrypt from "bcryptjs";

export const createUserRepo = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    return user;
  } catch (error) {
    throw new Error("User creation failed");
  }
};

export const loginUserRepo = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    return user;
  } catch (error) {
    throw new Error("User login failed");
  }
};

export const isAuthRepo = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("User authentication failed");
  }
};

export const findUserByEmailRepo = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    throw new Error("User retrieval failed");
  }
};

export const passwordResetRepo = async (email, token) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User not found");
    }
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordExpire: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
    return { success: true, message: "Password reset token generated" };
  } catch (error) {
    throw new Error("Password reset failed");
  }
};

export const resetPasswordRepo = async (email, newPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });
    return { success: true, message: "Password reset successful" };
  } catch (error) {
    throw new Error("Password reset failed");
  }
};
