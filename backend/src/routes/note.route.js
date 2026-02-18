import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/note.controller.js";
import authUser from "../middleware/user.middleware.js";
import rateLimiter from "../middleware/rateLimiter.middleware.js";

const router = express.Router();

router.use(rateLimiter, authUser);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
