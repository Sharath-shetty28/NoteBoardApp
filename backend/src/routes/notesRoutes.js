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

router.use(rateLimiter);

router.get("/", authUser, getAllNotes);
router.get("/:id", authUser, getNoteById);
router.post("/", authUser, createNote);
router.put("/:id", authUser, updateNote);
router.delete("/:id", authUser, deleteNote);

export default router;
