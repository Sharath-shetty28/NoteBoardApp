import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import notesRoutes from "./routes/note.route.js";
import authRoutes from "./routes/auth.route.js";
import rateLimiter from "./middleware/rateLimiter.middleware.js";
import path from "path";

dotenv.config();

import { startCleanupJob } from "./utils/cleanup.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(rateLimiter);
app.use(cookieParser());

startCleanupJob();

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

process.env.NODE_ENV = "production";

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
} else {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );
}

app.get("/", (req, res) => {
  res.send("API running in development 🚀");
});

export default app;
