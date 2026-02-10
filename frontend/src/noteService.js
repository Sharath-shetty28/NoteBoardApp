import api from "./lib/axios";
const ENDPOINT = "/notes";

// Fetch all notes
export async function fetchNotes() {
  try {
    const res = await api.get(ENDPOINT);
    return res.data;
  } catch (err) {
    console.log("Backend fetch failed");
  }
}

// Fetch single note
export async function fetchNote(id) {
  try {
    const res = await api.get(`${ENDPOINT}/${id}`);
    return res.data;
  } catch (err) {
    console.log("Backend fetch failed, single id:", id);
  }
}

// Create note
export async function createNote(note) {
  try {
    const res = await api.post(ENDPOINT, note);
    return res.data;
  } catch (err) {
    console.log("Create failed, saving offline...");
  }
}

// Update note
export async function updateNote(id, updates) {
  try {
    const res = await api.put(`${ENDPOINT}/${id}`, updates);
    return res.data;
  } catch (err) {
    console.log("Update failed, saving offline...");
  }
}

// Delete note
export async function deleteNote(id) {
  try {
    await api.delete(`${ENDPOINT}/${id}`);
    return true;
  } catch (err) {
    console.log("Delete failed, marking locally...");
  }
}
