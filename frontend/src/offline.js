import { db } from "./db";

export async function saveNote(note) {
  if (navigator.onLine) {
    // Online → send to backend
    const res = await fetch("/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    const savedNote = await res.json();
    // Save in IndexedDB with synced = true
    await db.notes.add({ ...savedNote, synced: true });
  } else {
    // Offline → save in IndexedDB with synced = false
    await db.notes.add({ ...note, synced: false });
  }
}

async function syncOfflineNotes() {
  const unsyncedNotes = await db.notes.where("synced").equals(false).toArray();
  if (unsyncedNotes.length > 0) {
    const res = await fetch("/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: unsyncedNotes }),
    });
    const { data } = await res.json();
    for (let note of data) {
      await db.notes.update(note.id, { synced: true, _id: note._id });
    }
  }
}

window.addEventListener("online", syncOfflineNotes);
