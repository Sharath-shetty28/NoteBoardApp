import api from "./lib/axios";
import {
  getAllNotes as getAllLocalNotes,
  getNote as getLocalNote,
  addNoteOffline,
  updateNote as updateLocalNote,
  deleteNote as deleteLocalNote,
} from "./idb";

const ENDPOINT = "/notes";

// Fetch all notes
export async function fetchNotes() {
  if (navigator.onLine) {
    try {
      const res = await api.get(ENDPOINT);
      return res.data; // ✅ from backend
    } catch (err) {
      console.log("Backend fetch failed, using local DB...");
      return await getAllLocalNotes();
    }
  } else {
    console.log("Offline, fetching notes locally...");
    return await getAllLocalNotes();
  }
}

// Fetch single note
export async function fetchNote(id) {
  if (navigator.onLine) {
    try {
      const res = await api.get(`${ENDPOINT}/${id}`);
      return res.data;
    } catch (err) {
      console.log("Backend fetch failed, using local DB...");
      return await getLocalNote(id);
    }
  } else {
    console.log("Offline, fetching note locally...");
    return await getLocalNote(id);
  }
}

// Create note
export async function createNote(note) {
  if (navigator.onLine) {
    try {
      const res = await api.post(ENDPOINT, note);
      return res.data;
    } catch (err) {
      console.log("Create failed, saving offline...");
      return await addNoteOffline(note);
    }
  } else {
    console.log("Offline, saving note locally...");
    return await addNoteOffline(note);
  }
}

// Update note
export async function updateNote(id, updates) {
  if (navigator.onLine) {
    try {
      const res = await api.put(`${ENDPOINT}/${id}`, updates);
      return res.data;
    } catch (err) {
      console.log("Update failed, saving offline...");
      return await updateLocalNote(id, { ...updates, synced: false });
    }
  } else {
    console.log("Offline, saving update locally...");
    return await updateLocalNote(id, { ...updates, synced: false });
  }
}

// Delete note
export async function deleteNote(id) {
  if (navigator.onLine) {
    try {
      await api.delete(`${ENDPOINT}/${id}`);
      return true;
    } catch (err) {
      console.log("Delete failed, marking locally...");
      return await deleteLocalNote(id);
    }
  } else {
    console.log("Offline, deleting locally...");
    return await deleteLocalNote(id);
  }
}
