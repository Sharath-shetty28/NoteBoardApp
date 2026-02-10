import prisma from "../config/db.js";

/**
 * GET ALL NOTES (for logged-in user)
 */
export async function getAllNotes(req, res) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET NOTE BY ID
 */
export async function getNoteById(req, res) {
  try {
    const noteId = Number(req.params.id);

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found!" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in getNoteById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * CREATE NOTE
 */
export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.user.id,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * UPDATE NOTE
 */
export async function updateNote(req, res) {
  try {
    const noteId = Number(req.params.id);
    const { title, content } = req.body;

    const updatedNote = await prisma.note.updateMany({
      where: {
        id: noteId,
        userId: req.user.id,
      },
      data: {
        title,
        content,
      },
    });

    if (updatedNote.count === 0) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * DELETE NOTE
 */
export async function deleteNote(req, res) {
  try {
    const noteId = Number(req.params.id);

    const deletedNote = await prisma.note.deleteMany({
      where: {
        id: noteId,
        userId: req.user.id,
      },
    });

    if (deletedNote.count === 0) {
      return res
        .status(404)
        .json({ message: "Note not found or not authorized" });
    }

    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
