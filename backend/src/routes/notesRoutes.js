import express from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote,
} from "../controllers/notesController.js";
import authUser from "../middleware/authUser.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/", authUser, rateLimiter, getAllNotes);
router.get("/:id", authUser, rateLimiter, getNoteById);
router.post("/", authUser, rateLimiter, createNote);
router.put("/:id", authUser, rateLimiter, updateNote);
router.delete("/:id", authUser, rateLimiter, deleteNote);

export default router;
