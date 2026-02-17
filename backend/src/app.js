import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/note.route.js";
import authRoutes from "./routes/auth.route.js";
import rateLimiter from "./middleware/rateLimiter.middleware.js";
import path from "path";
import { startCleanupJob } from "./utils/cleanup.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json()); // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);
app.use(cookieParser());

startCleanupJob();

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      withCredentials: true,
    }),
  );
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("API running in development 🚀");
});

export default app;
