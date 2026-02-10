import * as noteService from "../services/note.service.js";

/**
 * GET ALL NOTES (for logged-in user)
 */

export const getAllNotes = async (req, res) => {
  try {
    const notes = await noteService.getUserNotes(req.user.id);
    if (!notes || notes.length === 0) {
      return res.json({ message: "No notes found for this user." });
    }
    res.json(notes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * GET NOTE BY ID
 */
export const getNoteById = async (req, res) => {
  try {
    const note = await noteService.getUserNoteById(req.params.id, req.user.id);
    if (!note || note.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * CREATE NOTE
 */
export const createNote = async (req, res) => {
  try {
    const note = await noteService.createUserNote({
      ...req.body,
      userId: req.user.id,
    });
    if (!note) {
      return res.status(400).json({ message: "Failed to create note" });
    }
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * UPDATE NOTE
 */
export const updateNote = async (req, res) => {
  try {
    const noteId = Number(req.params.id);
    const { title, content } = req.body;
    if (!noteId) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const updatedNote = await noteService.updateUserNote(noteId, req.user.id, {
      title,
      content,
    });
    if (!updatedNote || updatedNote.length === 0) {
      return res
        .status(404)
        .json({ message: "Note not found or update failed" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE NOTE
 */
export const deleteNote = async (req, res) => {
  try {
    const noteId = Number(req.params.id);

    const deletedNote = await noteService.deleteUserNote(noteId, req.user.id);
    if (!deletedNote || deletedNote.length === 0) {
      return res
        .status(404)
        .json({ message: "Note not found or delete failed" });
    }

    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
