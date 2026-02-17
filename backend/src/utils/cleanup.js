import cron from "node-cron";
import prisma from "../config/db.js";
const DAYS_TO_KEEP = 30;

export const startCleanupJob = () => {
  // Runs every day at 2 AM
  cron.schedule("0 2 * * *", async () => {
    console.log("Running cleanup job...");

    try {
      const deleted = await prisma.note.deleteMany({
        where: {
          isDeleted: true,
          deletedAt: {
            lt: new Date(Date.now() - DAYS_TO_KEEP * 24 * 60 * 60 * 1000),
          },
        },
      });

      console.log(`Deleted ${deleted.count} old notes`);
    } catch (error) {
      console.error("Cleanup failed:", error);
    }
  });
};
