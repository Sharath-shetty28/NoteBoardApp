import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("POSTGRESQL (NEON) CONNECTED SUCCESSFULLY!");
  } catch (error) {
    console.error("Error connecting to POSTGRESQL", error);
    process.exit(1);
  }
};

export default prisma;
