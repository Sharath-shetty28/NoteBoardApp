import * as noteRepo from "../repositories/note.repo.js";

export const createUserNote = async (noteData) => {
  if (!noteData.title || !noteData.content)
    throw new Error("Title and content are required");
  return await noteRepo.createNote(noteData);
};

export const getUserNotes = async (userId, page, limit) => {
  if (!userId) throw new Error("User ID is required");
  return await noteRepo.getAllNotes(userId, page, limit);
};

export const updateUserNote = async (noteId, userId, noteData) => {
  if (!noteId || !userId || !noteData)
    throw new Error("All fields are required");
  return await noteRepo.updateNote(noteId, userId, noteData);
};

export const deleteUserNote = async (noteId, userId) => {
  if (!noteId || !userId) throw new Error("All fields are required");
  return await noteRepo.deletedNote(noteId, userId);
};

export const getUserNoteById = async (noteId, userId) => {
  if (!noteId || !userId) throw new Error("All fields are required");
  return await noteRepo.getNoteById(noteId, userId);
};
